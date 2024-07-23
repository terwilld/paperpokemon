var mongoose = require('mongoose');
var OrderSchema = mongoose.Schema({
    orderNumber: {
        type: Number,
        required: true
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

