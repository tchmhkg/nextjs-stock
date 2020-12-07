const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const axios = require('axios');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();
console.log('environment =',process.env.NODE_ENV);
let port = process.env.PORT || 3000;
let host = process.env.HOST || 'http://localhost';

const baseUrl = `${host}:${port}`
const getQuote = socket => {
    const symbol = socket.handshake.query['symbol'];

    axios
      .get(baseUrl + '/api/market/quotes', {
        params: {
          symbol,
        },
      })
      .then((res) => {
        if (res?.data) {
          socket.emit('FromAPI', res.data.data);
        }
      })
      .catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message);
        } else {
          console.log(thrown);
        }
      });
};

let interval;

io.on('connection', socket => {
    console.log('Client connected');
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getQuote(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
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