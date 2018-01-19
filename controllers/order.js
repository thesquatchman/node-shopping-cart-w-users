const Order = require('../models/order');
const securityController = require('../controllers/security');

//'/api/orders'
exports.getOrders = function (req, res) {
    Order.find(function(err, items) {
        if (err)
            res.send(err);

        res.json(items);
    });
};

exports.updateOrder = function (req, res) {
	Order.findOne({ _id: req.params.order_id }, function(err, order) {
				order.status = req.body.status;
				order.tracking = req.body.tracking;
				
        order.save(function (err) {
            if(err) {
                console.error('ERROR!');
            }
            res.json(order)
        });
    });
};
