'use strict';
//load local variables
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
const config = require('./lib/config.js');
const port = process.env.PORT || 8080;

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL);

const productController = require('./controllers/product');
const cartController = require('./controllers/cart');
const checkoutController = require('./controllers/checkout');
const securityController = require('./controllers/security');


const store = new MongoDBStore({
    uri: config.db.url,
    collection: config.db.sessions
});


app.disable('x-powered-by');

app.set('view engine', 'ejs');
app.set('env', 'development');

app.locals.paypal = config.paypal;
app.locals.locale = config.locale;



app.use(express.static('public'));
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

var router = express.Router();


router.route('/')
    .get(productController.renderProducts);

router.route('/api/products')
    .post(productController.postProduct)
    .get(productController.getProducts);

router.route('/cart')
    .post(cartController.postCart)
    .get(cartController.renderCart);

router.route('/cart/update')
    .post(cartController.updateCart)

router.route('/cart/remove/:id/:nonce')
    .get(cartController.removeItem);   

router.route('/cart/empty/:nonce')
    .get(cartController.emptyCart); 

router.route('/checkout')
    .post(checkoutController.postCheckout)
    .get(checkoutController.renderCheckout);

// Register all our routes with /api
app.use(router);

app.listen(port, console.log('listening on port '+port));