'use strict';

var mongoose  = require('mongoose');

var ProductSchema = new mongoose.Schema({
    product_id: {
    	type:Number,
    	required: true
    },
    title: {
    	type:String
    },
    description: {
    	type:String
    },
    manufacturer: {
    	type:String
    },
    price: {
    	type:Number
    },
    image: {
    	type:String
    }
});

module.exports = mongoose.model('Product', ProductSchema);