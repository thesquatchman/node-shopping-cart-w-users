'use strict';
//load local variables
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
const config = require('./lib/config.js');
const port = process.env.PORT || 8080;

mongoose.Promise = Promise;
mongoose.createConnection(process.env.MONGODB_URL);

// const Products = require('./models/Products');
// const Cart = require('./lib/Cart');
const Security = require('./lib/Security');

const store = new MongoDBStore({
    uri: config.db.url,
    collection: config.db.sessions
});


app.disable('x-powered-by');

app.set('view engine', 'ejs');
app.set('env', 'development');

app.locals.paypal = config.paypal;
app.locals.locale = config.locale;


app.use('/public', express.static(path.join(__dirname, '/public'), {
  maxAge: 0,
  dotfiles: 'ignore',
  etag: false
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    store: store,
    unset: 'destroy',
    name: config.name
}));

app.get('/', (req, res) => {
  	res.render('index', {
          pageTitle: 'Node.js Shopping Cart',
          products: [],
          nonce: Security.md5(req.sessionID + req.headers['user-agent'])
      });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
});

app.listen(port);