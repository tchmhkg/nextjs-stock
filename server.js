const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const axios = require('axios');
const LRUCache = require('lru-cache');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();
console.log('environment =',process.env.NODE_ENV);
let port = process.env.PORT || 3000;
let host = process.env.HOST || 'http://localhost';

// This is where we cache our rendered HTML pages
const ssrCache = new LRUCache({
  max: 100 * 1024 * 1024, /* cache size will be 100 MB using `return n.length` as length() function */
  length: function (n, key) {
      return n.length
  },
  maxAge: 1000 * 60 * 60 * 24 * 30
})

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

    app.get('/_next/*', (req, res) => {
      /* serving _next static content using next.js handler */
      handle(req, res);
    });

    app.get('*', (req, res) => {
        /* serving page */
        return renderAndCache(req, res)
    });

    server.listen(port, err => {
        if(err) throw err;
        console.log(`> Ready on ${host}:${port}`);
    })
})


/*
 * NB: make sure to modify this to take into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
function getCacheKey(req) {
  return `${req.path}`
}

async function renderAndCache(req, res) {
  const key = getCacheKey(req);

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key)) {
      //console.log(`serving from cache ${key}`);
      res.setHeader('x-cache', 'HIT');
      res.send(ssrCache.get(key));
      return
  }

  try {
      //console.log(`key ${key} not found, rendering`);
      // If not let's render the page into HTML
      const html = await app.renderToHTML(req, res, req.path, req.query);

      // Something is wrong with the request, let's skip the cache
      if (res.statusCode !== 200) {
          res.send(html);
          return
      }

      // Let's cache this page
      ssrCache.set(key, html);

      res.setHeader('x-cache', 'MISS');
      res.send(html)
  } catch (err) {
      app.renderError(err, req, res, req.path, req.query)
  }
}