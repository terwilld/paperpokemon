var express = require('express');
var router = express.Router();

var Click = require('../models/click')

router.get('/click', async function (req, res) {
    //console.log(req.query)
    //console.log(req.query.publisherID)
    //console.log(req.query.destinationURL)
    maxClick = await Click.findOne()
        .sort({ clickID: -1 })

    if (maxClick == null) {
        newClick = new Click({ clickID: 1 })

    } else {
        maxClickID = maxClick.clickID
        newClick = new Click({ clickID: maxClickID + 1 })
    }
    newClick.publisherID = req.query.publisherID
    res.cookie('eventID', newClick.clickID)
    res.cookie('publisherID', req.query.publisherID)
    //console.log(newClick)
    await newClick.save()
    res.redirect(req.query.destinationURL)

});

router.get('/converted', async function (req, res) {

    console.log(req.query)
    var CJEVENT = parseInt(req.query.CJEVENT)
    console.log(CJEVENT)
    convertedClick = await Click.findOne({ clickID: CJEVENT })
    try {
        console.log(convertedClick)

        convertedClick.converted = true
        convertedClick.total = req.query.AMOUNT
        convertedClick.currency = req.query.CURRENCY
        convertedClick.externalOrderNumber = req.query.OID
        convertedClick.timeConverted = Date.now()
        await convertedClick.save()
        console.log(convertedClick)

    } catch (e) {
        console.log(e)
    }
})

module.exports = router;

