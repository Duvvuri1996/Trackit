let jwt = require('jsonwebtoken')
let shortId = require('shortid')
let secret = '22Dhruv2017$'


let generateJwt = (data,cb) => {
    try{
    let claims = {
        jwtid : shortId.generate(),
        iat : Date.now(),
        /**
         * Dat.now() returns the number of milliseconds elapsed since January 1, 1970, 00:00:00 UTC
         * and converting to seconds by dividing with 1000 and adding 86400 secs = 24hrs giving expiration after one day
         */
        exp : Math.floor(Date.now()/1000)+(60*60*24),
        //issuer
        iss : 'Dsplanner',
        sub : 'authToken',
        data : data
    }
    let tokenDetails = {
        token : jwt.sign(claims,secret),
        tokenSecret : secret
    }
    cb(null,tokenDetails)
} catch(err) {
    console.log(err)
    cb(err,null)
}
} //end generate token

let verifyToken = (token, secret,cb) => {
    console.log(token)
    console.log(secret)
    jwt.verify(token, secret, function(err,decoded) {
        if(err) {
            console.log("Token verification error")
            console.log(err)+ " is this"
            cb(err,null)
        } else {
            console.log("User verified")
            cb(null,decoded)
        }
    })
} //end verify token

let verifyTokenWithoutSecret = (token,cb) => {
    jwt.verify(token,secret, function(err,decoded){
        if(err){
            console.log("Token verification error")
            console.log(err)
            cb(err,null)
        } else {
            console.log("User verified")
            console.log(decoded)
            cb(null,decoded)
        }
    })
} //end verify token without secret

module.exports = {
 generateJwt : generateJwt,
 verifyToken : verifyToken,
 verifyTokenWithoutSecret : verifyTokenWithoutSecret   
}