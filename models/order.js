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
    address: {
        type: String
    },
    address2: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zip: {
        type: String
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
    }

});



// Export the Mongoose model
module.exports = mongoose.model('Order', OrderSchema);