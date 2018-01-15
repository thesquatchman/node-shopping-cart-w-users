const Cart = require('../lib/Cart');
const Product = require('../models/product');
const securityController = require('../controllers/security');


exports.renderCart = function(req, res) {
    let sess = req.session;
    let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
    res.render('cart', {
        pageTitle: 'Cart',
        cart: cart,
        nonce: securityController.md5(req.sessionID + req.headers['user-agent'])
    });
};

exports.postCart = function(req, res) {
    let qty = parseInt(req.body.qty, 10);
    let product = parseInt(req.body.product_id, 10);
    if(qty > 0 && securityController.isValidNonce(req.body.nonce, req)) {
        Product.findOne({product_id: product}).then(prod => {
            Cart.addToCart(prod, qty);
            Cart.saveCart(req);
            res.redirect('/cart');
        }).catch(err => {
           res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
};

//'/cart/update'
exports.updateCart = function (req, res) {
    let ids = req.body["product_id[]"];
    let qtys = req.body["qty[]"];
    ids = Array.isArray(ids) ? ids : [ids];
    qtys = Array.isArray(qtys) ? qtys : [qtys];
    if(securityController.isValidNonce(req.body.nonce, req)) {
        Cart.updateCart(ids, qtys);
        Cart.saveCart(req);
        res.redirect('/cart');
    } else {
        res.redirect('/');
    }
};

//'/cart/remove/:id/:nonce' 
exports.removeItem = function (req, res) {
   let id = req.params.id;
   if(/^\d+$/.test(id) && securityController.isValidNonce(req.params.nonce, req)) {
       Cart.removeFromCart(parseInt(id, 10));
       Cart.saveCart(req);
       res.redirect('/cart');
   } else {
       res.redirect('/');
   }
};

//'/cart/empty/:nonce'
exports.emptyCart = function (req, res) {
    if(securityController.isValidNonce(req.params.nonce, req)) {
        Cart.emptyCart(req);
        res.redirect('/cart');
    } else {
        res.redirect('/');
    }
};
