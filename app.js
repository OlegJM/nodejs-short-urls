const express = require('express');
const bodyParser = require('body-parser');
const { URL } = require('url');

const serverConfig = require('./server/config').server;
const { insertLongLink, getLink } = require('./server/helpers/sqlite');
const { encode, decode } = require('./server/helpers/codec');

const app = express();

app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Cокращатель ссылок v0.1'
  });
});

app.get('/:url', async (req, res) => {
  const linkId = decode(req.params.url);
  const longUrl = await getLink(linkId);

  if (!longUrl) {
    res.status(404);
    res.render('not-found', {
      title: '404 - Not Found'
    });
    return;
  }

  res.status(301).redirect(longUrl);
});

app.post('/api/save_url', async (req, res) => {
  try {
    const result = await insertLongLink(req.body.url);
    const { linkId } = result;
    const currentUrl = new URL(req.headers.origin);
    currentUrl.pathname = encode(linkId);

    res.send({ shortLink: currentUrl });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(serverConfig.port, serverConfig.hostname, () => console.log('Сервер работает'));
