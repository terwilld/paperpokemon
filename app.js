var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
var passport = require('passport');
var mkdirp = require('mkdirp')
var cookieParser = require('cookie-parser')

// Connect to db
if (process.env.NODE_ENV == "production") {
    dbURL = process.env.dbURL;
    secret = process.env.secret;

} else {
    dbURL = 'mongodb://127.0.0.1:27017/pokemonshop';
    secret = 'secret';
}
mongoose.connect(dbURL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected by mongoose")
    console.log(dbURL)
})

// Init app
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser())
// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set global errors variable
app.locals.errors = null;

// Get Page Model
var Page = require('./models/page');



// Get all pages to pass to header.ejs
// Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
//     if (err) {
//         console.log(err);
//     } else {
//         app.locals.pages = pages;
//     }
// });



Page.find({}).sort({ sorting: 1 }).then((pages) => {
    app.locals.pages = pages;
}).catch((err) => {
    console.log(err);
});



// Get Category Model
var Category = require('./models/category');

// Get all categories to pass to header.ejs
// Category.find(function (err, categories) {
//     if (err) {
//         console.log(err);
//     } else {
//         app.locals.categories = categories;
//     }
// });

// Category.find({}).exec(function (err, pages) {
//     if (err) {
//         console.log(err);
//     } else {
//         app.locals.categories = categories;
//     }
// });


Category.find({}).then((categories) => {
    app.locals.categories = categories;
}).catch((err) => {
    console.log(err);
});

// Express fileUpload middleware
app.use(fileUpload());

// Body Parser middleware
// 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Express Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
    //  cookie: { secure: true }
}));

// Express Validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
});

// Set routes 
var pages = require('./routes/pages.js');
var products = require('./routes/products.js');
var cart = require('./routes/cart.js');
var users = require('./routes/users.js');
var adminPages = require('./routes/admin_pages.js');
var adminCategories = require('./routes/admin_categories.js');
var adminProducts = require('./routes/admin_products.js');
var api = require('./routes/api.js')
var adminOrders = require('./routes/adminOrders.js')
var adminClicks = require('./routes/adminClicks.js')

app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/admin/orders', adminOrders)
app.use('/admin/clicks', adminClicks)
app.use('/products', products);
app.use('/cart', cart);
app.use('/users', users);
app.use('/', pages);
app.use('/api', api)

// Start the server
var port = 3001;
app.listen(port, function () {
    console.log('Server started on port ' + port);
});


//  Initialize 
try {
    mkdirp('public/product_images/')
} catch (e) {
    console.log(e)
}