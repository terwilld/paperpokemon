var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcryptjs');

module.exports = function (passport) {

    passport.use(new LocalStrategy(function (username, password, done) {

        // User.findOne({username: username}, function (err, user) {
        //     if (err)
        //         console.log(err);

        //     if (!user) {
        //         return done(null, false, {message: 'No user found!'});
        //     }

        //     bcrypt.compare(password, user.password, function (err, isMatch) {
        //         if (err)
        //             console.log(err);

        //         if (isMatch) {
        //             return done(null, user);
        //         } else {
        //             return done(null, false, {message: 'Wrong password.'});
        //         }
        //     });
        // });


        console.log("Test")
        User.findOne({ username: username })
            .then((foundUser) => {
                console.log(foundUser)
                if (!foundUser) {
                    return done(null, false, { message: 'No user found!' });
                }
                bcrypt.compare(password, foundUser.password, function (err, isMatch) {
                    if (err)
                        console.log(err);
                    if (isMatch) {
                        return done(null, foundUser);
                    } else {
                        return done(null, false, { message: 'Wrong password.' });
                    }
                });
            })
            .catch((err) => {
                console.log(err)
            })

    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        console.log(id)
        User.findById(id)
            .then((user) => {
                var err = null
                done(err, user)
            })

        // User.findById(id, function (err, user) {
        //     done(err, user);
        // });
    });

}

