let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');
let bcrypt = require('bcryptjs');

module.exports =  (passport) => {


    passport.use(new LocalStrategy(
        {usernameField: 'email',
        passwordField: 'password' },
        (username, password, done) => {
        User.findOne({email: username}, (err, user) => {
            console.log("USER.FINDONE")
            if (err)
                console.log(err);

            if (!user) {
                console.log("User not founded")
                return done(null, false);
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err)
                    console.log(err);

                if (isMatch) {
                    console.log("Passwords match")
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        });
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

}