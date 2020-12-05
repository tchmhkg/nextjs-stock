const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const WebSocket = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();
console.log('environment =',process.env.NODE_ENV);
let port = process.env.PORT || 3000;
let host = process.env.HOST || 'http://localhost';

const SOCKET_MAP = {
    crypto: 'crypto',
    fx: 'fx',
    stock: 'iex'
}

let subscribe = {
    'eventName':'subscribe',
    'authorization':process.env.TIINGO_API_KEY,
    'eventData': {
        'thresholdLevel': 2,
    }
}

let unsubscribe = {
    'eventName':'unsubscribe',
    'authorization':process.env.TIINGO_API_KEY,
}

function connect(socket) {
    try {
    const type = socket.handshake.query['type'];
    var ws = new WebSocket(`wss://api.tiingo.com/${SOCKET_MAP[type]}`);
    console.log('query params => ',socket.handshake.query['symbol']);

    ws.on('open', function open() {
        console.log('opened');
        subscribe.eventData.tickers = JSON.parse(socket.handshake.query['symbol']);
        if(socket.handshake.query['thresholdLevel']) {
            subscribe.eventData.thresholdLevel = socket.handshake.query['thresholdLevel'];
        }
        ws.send(JSON.stringify(subscribe));
    });
    
    ws.on('message', function(data, flags) {
        // console.log('api message => ',data);
        const parseData = JSON.parse(data);
        if(parseData.messageType === 'I') {
            console.log('return subscriptionId',parseData.data.subscriptionId);
            socket.emit('api message', {
                subscriptionId: parseData.data.subscriptionId
            });
        }
        if(parseData.data && ((type === 'crypto' && parseData.data[0] === 'Q') || type === 'stock' && (parseData.data[0] === 'T' || parseData.data[0] === 'Q'))) {
            socket.emit('api message', {
                message: data
            });
        }
    });
    
    ws.on('error', (e) => {
        console.log('error => ',e.message);
        socket.emit('error', {
            message: e
        });
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
        ws.close();
        // setTimeout(function() {
        //     console.log('will reconnect');
        //     connect(socket);
        // }, 1000);
    })

    socket.on('unsubscribe', (data) => {
        console.log('unsubscribe ->',data);
        ws.send(JSON.stringify(unsubscribe));
        // setTimeout(function() {
        //     console.log('will reconnect');
        //     connect(socket);
        // }, 1000);
    })

    socket.on('close', (e) => {
        console.log('closed ->',e.reason);
        ws.close();
    })
    } catch (err) {
        console.log('server websocket error => ',err);
    }
}

io.on('connection', socket => {
    console.log('connected');
    connect(socket);
});

nextApp.prepare().then(() => {
    app.get('*', (req, res) => {
        return nextHandler(req, res);
    });

    server.listen(port, err => {
        if(err) throw err;
        console.log(`> Ready on ${host}:${port}`);
    })
})