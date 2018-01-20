const Order = require('../models/order');
const securityController = require('../controllers/security');

//'/api/orders'
exports.getOrders = function (req, res) {
    Order.find(function(error, orders) {
        if (error)
            res.json({error});

        res.json({success: true, orders:orders});
    });
};

exports.updateOrder = function (req, res) {
	Order.findOne({ _id: req.params.order_id }, function(error, order) {
				order.status = req.body.status;
				order.tracking = req.body.tracking;
				
        order.save(function (error) {
            if(error) {
                res.json({success: false, error})
            }
            res.json({success: true, order})
        });
    });
};
