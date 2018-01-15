const Product = require('../models/product');
const securityController = require('../controllers/security');

//render '/' with products data
exports.renderProducts = function(req, res) {
    Product.find({price: {'$gt': 0}}).sort({price: -1}).limit(6).then(products => {
          let format = new Intl.NumberFormat(req.app.locals.locale.lang, {style: 'currency', currency: req.app.locals.locale.currency });
          products.forEach( (product) => {
             product.formattedPrice = format.format(product.price);
          });
          res.render('index', {
              pageTitle: 'Node.js Shopping Cart',
              products: products,
              nonce: securityController.md5(req.sessionID + req.headers['user-agent'])
          });

      }).catch(err => {
          res.status(400).send('Bad request');
    });
};



// Create endpoint /api/products for POST
exports.postProduct = function(req, res) {
    // Create a new instance of the Product model

    var product = new Product();

    // Set the product properties that came from the POST data
    product.product_id = req.body.product_id ;
    product.title = req.body.title;
    product.description = req.body.description;
    product.manufacturer = req.body.manufacturer;
    product.price = req.body.price;
    product.image = req.body.image;
    product.save(function(err) {

        if (err) {
            
          return  res.send(err);
        }
        res.json(product);
    });
};

exports.getProducts = function(req, res) {
    Product.find({price: {'$gt': 0}}).sort({price: -1}).limit(6).then(products => {
          let format = new Intl.NumberFormat(req.app.locals.locale.lang, {style: 'currency', currency: req.app.locals.locale.currency });
          products.forEach( (product) => {
             product.formattedPrice = format.format(product.price);
          });
          res.json({
              products: products,
              nonce: securityController.md5(req.sessionID + req.headers['user-agent'])
          });

      }).catch(err => {
          res.status(400).send('Bad request');
    });
};
