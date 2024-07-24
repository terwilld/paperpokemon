
var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;
var Click = require('../models/click')

router.get('/', isAdmin, async function (req, res) {


    Clicks = await Click.find({})
        .sort({ clickID: -1 })
    res.render('admin/clicks', { Clicks: Clicks })

})


module.exports = router;



