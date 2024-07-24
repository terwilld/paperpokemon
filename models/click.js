var mongoose = require('mongoose');


var ClickSchema = mongoose.Schema({
    clickID: {
        type: Number,
        required: true
    },
    converted: {
        type: Boolean,
        default: false
    },
    publisherID: {
        type: String,
        required: true
    },
    timeClicked:
    {
        type: Date,
        default: Date.now
    },
    total: {
        type: Number
    },
    externalOrderNumber: {
        type: String
    },
    currency: {
        type: String
    },
    timeConverted: {
        type: Date
    }

});
var Click = module.exports = mongoose.model('Click', ClickSchema);