var express = require('express');
var router = express.Router();

// Get Page model
var Page = require('../models/page');

/*
 * GET /
 */
router.get('/', async function (req, res) {
    currentPage = await Page.findOne({ slug: 'home' })
    if (currentPage == null) {
        console.log("no entry")
        newPage = new Page(
            {
                slug: 'home',
                title: 'Home',
                content: 'Welcome to my page!'
            }
        )

        await newPage.save()
    }
    Page.findOne({ slug: 'home' })
        .then((page) => {

            //console.log(page)
            //console.log(`Page Title: ${page.title}`)
            //console.log(`Page content: ${page.content}`)
            res.render('index', {
                title: page.title,
                content: page.content
            })
        }).catch((err) => {
            console.log(err);
        });

    // Page.findOne({slug: 'home'}, function (err, page) {
    //     if (err)
    //         console.log(err);

    //     res.render('index', {
    //         title: page.title,
    //         content: page.content
    //     });
    // });


});

/*
 * GET a page
 */
router.get('/:slug', function (req, res) {

    var slug = req.params.slug;

    Page.findOne({ slug: slug })
        .then((page) => {
            if (!page) {
                res.redirect('/');
            } else {
                res.render('index', {
                    title: page.title,
                    content: page.content
                });
            }
        })
        .catch((err) => {
            console.log(err)
        })
    // Page.findOne({ slug: slug }, function (err, page) {
    //     if (err)
    //         console.log(err);

    //     if (!page) {
    //         res.redirect('/');
    //     } else {
    //         res.render('index', {
    //             title: page.title,
    //             content: page.content
    //         });
    //     }
    // });


});

// Exports
module.exports = router;


