const Cart = require('../lib/Cart');
const Order = require('../models/order');
const securityController = require('../controllers/security');

//'/checkout'
exports.renderCheckout = function (req, res) {
    let sess = req.session;
    let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
    res.render('checkout', {
        pageTitle: 'Checkout',
        cart: cart,
        order: false,
        nonce: securityController.md5(req.sessionID + req.headers['user-agent'])
    });
};

exports.postCheckout = function (req, res) {
    let sess = req.session;
    let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
    if(securityController.isValidNonce(req.body.nonce, req)) {
            var order = new Order();

            // Set the product properties that came from the POST data
            order.user_id = req.session.user ? req.session.user._id : req.body.email;
            order.firstname = req.body.firstname;
            order.lastname = req.body.lastname;
            order.email = req.body.email;
            order.address = req.body.address;
            order.city = req.body.city;
            order.state = req.body.state;
            order.zip = req.body.zip;
            order.items = cart.items;
            order.totals = cart.totals;
            
            order.save(function(err) {

                if (err) {
                    
                  return  res.send(err);
                }
                 
                Cart.emptyCart(req);
                res.render('checkout', {
                    pageTitle: 'Checkout',
                    cart: false,
                    order: order
                });
            });
        
    } else {
        res.redirect('/');
    }
};
