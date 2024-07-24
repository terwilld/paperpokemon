var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var Order = require('../models/order')
var isAdmin = auth.isAdmin;

module.exports = router;


router.get('/', isAdmin, async function (req, res) {

    Orders = await Order.find({})
        .sort({ orderNumber: -1 })

    console.log(Orders)
    res.render('admin/orders', { Orders: Orders })

    //res.send("inOrders")
})

