// Load required packages
var mongoose = require('mongoose');



// Define our user schema
var OrderSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    billing: {
        address: String,
        address2: String,
        city: String,
        state: String,
        zip: String
    },
    shipping: {
        address: String,
        address2: String,
        city: String,
        state: String,
        zip: String
    },
    items: {
        type: Array
    },
    totals: {
        type: Number
    },
    status: {
        type: String,
        default: 'pending'
    },
    tracking: {
        type: String
    }

}, {timestamps: true});



// Export the Mongoose model
module.exports = mongoose.model('Order', OrderSchema);