var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var auth = require('../config/auth');
var isUser = auth.isUser;

// Get Product model
var Product = require('../models/product');

// Get Category model
var Category = require('../models/category');

/*
 * GET all products
 */
router.get('/', function (req, res) {
    //router.get('/', isUser, function (req, res) {

    // Product.find(function (err, products) {
    //     if (err)
    //         console.log(err);

    //     res.render('all_products', {
    //         title: 'All products',
    //         products: products
    //     });
    // });

    Product.find({})
        .then((products) => {
            res.render('all_products', {
                title: 'All products',
                products: products
            });
        })
        .catch((err) => {
            console.log(err)
        })



});


/*
 * GET products by category
 */
router.get('/:category', function (req, res) {

    var categorySlug = req.params.category;

    Category.findOne({ slug: categorySlug })
        .then((c) => {
            Product.find({ category: categorySlug })
                .then((products) => {
                    res.render('cat_products', {
                        title: c.title,
                        products: products
                    });
                })
                .catch((err) => {
                    console.log(err)
                })
        })
        .catch((err) => {
            console.log(err)
        })

    // Category.findOne({ slug: categorySlug }, function (err, c) {
    //     Product.find({ category: categorySlug }, function (err, products) {
    //         if (err)
    //             console.log(err);
    //         res.render('cat_products', {
    //             title: c.title,
    //             products: products
    //         });
    //     });
    // });

});

/*
 * GET product details
 */
router.get('/:category/:product', function (req, res) {
    //console.log("This is my current shopping cart")
    //console.log(req.session.cart)
    var galleryImages = null;
    var loggedIn = (req.isAuthenticated()) ? true : false;
    Product.findOne({ slug: req.params.product })
        .then((product) => {
            var galleryDir = 'public/product_images/' + product._id + '/gallery';
            fs.readdir(galleryDir, function (err, files) {
                if (err) {
                    console.log(err);
                    res.redirect('/')
                } else {
                    galleryImages = files;

                    res.render('product', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages,
                        loggedIn: loggedIn
                    });
                }
            });
        })
        .catch((err) => {
            console.log(err)
        })


    // Product.findOne({ slug: req.params.product }, function (err, product) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         var galleryDir = 'public/product_images/' + product._id + '/gallery';

    //         fs.readdir(galleryDir, function (err, files) {
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 galleryImages = files;

    //                 res.render('product', {
    //                     title: product.title,
    //                     p: product,
    //                     galleryImages: galleryImages,
    //                     loggedIn: loggedIn
    //                 });
    //             }
    //         });
    //     }
    // });





});

// Exports
module.exports = router;


