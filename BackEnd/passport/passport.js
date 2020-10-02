const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const time = require('../app/libs/time');

//const User = mongoose.model('SocialUser');
const User = require('../app/models/socialUserModel');

const logger = require('../app/libs/logger');
const check = require('../app/libs/check');

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user => {
        done(null, user)
    })
})

passport.use(new GoogleStrategy({
    clientID : "546912140270-6dojcf88mt91eqo3q5pfcqgk9psora4q.apps.googleusercontent.com",
    clientSecret : "z3tfgOeX_WcxwEBAMbc7A9Im",
    callbackURL: "/auth/google/callback",
    proxy: true
}, 
function(accessToken, refreshToken, profile, cb){
    for(let x of profile.emails){
        var email = x.value
    }
    User.findOne({ userId : profile.id })
    .exec((err, userDetails) => {
        if(err) {
            logger.error(err.message, "Unknown error at passport find() function", 10)
            cb(err, null)
        } else if(check.isEmpty(userDetails)){
            let newUser = new User ({
                userId : profile.id,
                firstName : profile.name.givenName,
                lastName : profile.name.familyName,
                email : email,
                createdOn : time.now()
            })
            newUser.save((user) => {
                cb(null, user)
            })
            
        } else { 
            cb(null, userDetails)
        }
    })
}))