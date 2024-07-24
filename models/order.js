var mongoose = require('mongoose');
var OrderSchema = mongoose.Schema({

    orderNumber: {
        type: Number,
        required: true
    },

    total: {
        type: Number
    },

    itemCount: {
        type: Number
    },

    purchaseTime: {
        type: Date,
        default: Date.now
    },
    buyer: {
        type: String
    },
    publisherID: {
        type: String
    },
    order: [{
        name: {
            type: String,
            required: true
        },
        qty: {
            type: Number,
            required: true
        },
        SKU: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }]
});
var Order = module.exports = mongoose.model('Order', OrderSchema);

