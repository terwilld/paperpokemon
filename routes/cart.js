var express = require('express');
var router = express.Router();

// Get Product model
var Product = require('../models/product');
var Order = require('../models/order')
var Click = require('../models/click')
/*
 * GET add product to cart
 */
router.get('/add/:product', function (req, res) {

    var slug = req.params.product;

    Product.findOne({ slug: slug })
        .then((p) => {
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image: '/product_images/' + p._id + '/' + p.image
                });
            } else {
                var cart = req.session.cart;
                var newItem = true;

                for (var i = 0; i < cart.length; i++) {
                    if (cart[i].title == slug) {
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }

                if (newItem) {
                    cart.push({
                        title: slug,
                        qty: 1,
                        price: parseFloat(p.price).toFixed(2),
                        image: '/product_images/' + p._id + '/' + p.image
                    });
                }
            }
            //        console.log(req.session.cart);
            req.flash('success', 'Product added!');
            res.redirect('back');
        })
        .catch((err) => {
            console.log(err)
        })

    //     Product.findOne({slug: slug}, function (err, p) {
    //         if (err)
    //             console.log(err);

    //         if (typeof req.session.cart == "undefined") {
    //             req.session.cart = [];
    //             req.session.cart.push({
    //                 title: slug,
    //                 qty: 1,
    //                 price: parseFloat(p.price).toFixed(2),
    //                 image: '/product_images/' + p._id + '/' + p.image
    //             });
    //         } else {
    //             var cart = req.session.cart;
    //             var newItem = true;

    //             for (var i = 0; i < cart.length; i++) {
    //                 if (cart[i].title == slug) {
    //                     cart[i].qty++;
    //                     newItem = false;
    //                     break;
    //                 }
    //             }

    //             if (newItem) {
    //                 cart.push({
    //                     title: slug,
    //                     qty: 1,
    //                     price: parseFloat(p.price).toFixed(2),
    //                     image: '/product_images/' + p._id + '/' + p.image
    //                 });
    //             }
    //         }

    // //        console.log(req.session.cart);
    //         req.flash('success', 'Product added!');
    //         res.redirect('back');
    //     });



});

/*
 * GET checkout page
 */
router.get('/checkout', function (req, res) {

    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');
    } else {
        res.render('checkout', {
            title: 'Checkout',
            cart: req.session.cart
        });
    }

});

/*
 * GET update product
 */
router.get('/update/:product', function (req, res) {

    var slug = req.params.product;
    var cart = req.session.cart;
    var action = req.query.action;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if (cart[i].qty < 1)
                        cart.splice(i, 1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0)
                        delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }

    req.flash('success', 'Cart updated!');
    res.redirect('/cart/checkout');

});

/*
 * GET clear cart
 */
router.get('/clear', function (req, res) {

    delete req.session.cart;

    req.flash('success', 'Cart cleared!');
    res.redirect('/cart/checkout');

});

/*
 * GET buy now
 */
router.get('/buynow', function (req, res) {

    delete req.session.cart;

    res.sendStatus(200);

});


router.get('/confirmation', async function (req, res) {
    var cart = req.session.cart;

    //console.log(cart)

    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');
    } else {
        req.session.cart = []
        var total = 0
        maxOrder = await Order.findOne()
            .sort({ orderNumber: -1 })

        if (maxOrder == null) {
            newOrder = new Order({ orderNumber: 1 })

        } else {
            maxOrderNumber = maxOrder.orderNumber
            newOrder = new Order({ orderNumber: maxOrderNumber + 1 })
        }

        newOrderItems = []
        itemCount = 0
        for (item of cart) {
            //console.log(item)
            newItem = {
                name: item.title,
                price: parseInt(item.price),
                qty: item.qty,
                SKU: item.title
            }
            itemCount = itemCount += item.qty
            total = total += parseInt(item.price) * item.qty
            newOrderItems.push(newItem)
        }
        newOrder.order = newOrderItems
        newOrder.itemCount = itemCount
        newOrder.buyer = req.user.username
        newOrder.total = total

        foundClick = await Click.find({ clickID: req.cookies.eventID })


        // Bug in here
        if (foundClick == null) {
            newOrder.publisherID = 'No publisher found'

        } else {
            newOrder.publisherID = foundClick.publisherID
        }
        await newOrder.save()


        res.render('confirmation', {
            title: 'Thank you!',
            cart: cart,
            order: newOrder,
            total: total,
            CJEVENT: req.cookies.eventID
        });
    }
})


// Exports
module.exports = router;


