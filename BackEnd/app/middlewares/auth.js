const mongoose = require('mongoose');
const Auth = mongoose.model('Auth')

const logger = require('../libs/logger');
const response = require('../libs/response');
const token = require('../libs/token');
const check = require('../libs/check');

let isAuthorized = (req,res,next) => {
    console.log(req.header('authToken'))
    if(req.params.authToken || req.header('authToken') || req.body.authToken || req.query.authToken ) {
        Auth.findOne({authToken : req.params.authToken || req.body.authToken || req.query.authToken || req.header('authToken')}, (err, details) => {
           if(err) {
            console.log(details.authToken)
            console.log(details.tokenSecret)
               logger.error(err.message, "Authorization middleware", 10)
               let apiResponse  = response.generate(true, "Unexpected error occured", 500, null)
               res.send(apiResponse)
           } else if(check.isEmpty(details)) {
               logger.error("No details found", "Authorization middleware", 10)
               let apiResponse = response.generate(true, "No details found", 404, null)
               res.send(apiResponse)
           } else {
               token.verifyToken(details.authToken, details.tokenSecret, (err, decoded) => {
                   if(err) {
                       logger.error(err.message, "Authorization middleware", 7)
                       let apiResponse = response.generate(true, "Authtoken Verification error", 401)
                       res.send(apiResponse)
                   } else {
                       logger.info("Authorization successful", "Authorization middleware", 0)
                       req.user = { userId : decoded.data.userId}
                       console.log(req.user)
                       next()
                   }
               })
           }

           })
    } else {
        logger.error("Authtoken is missing in request", "Authorization middleware", 10)
        let apiResponse = response.generate(true, "Authtoken is missing in request", 400, null)
        res.send(apiResponse)
    }
}

module.exports = {
    isAuthorized : isAuthorized
}