const mongoose = require('mongoose');
const appConfig = require('/home/sowmya/trackIt/trackItBackEnd/config/config')
const shortid = require('shortid');
const authModel = require('../models/authModel');
const userModel = require('../models/userModel');
const socialModel = require('../models/socialUserModel');
const paramsLib = require('../libs/params');
const passwordLib = require('../libs/password');
const timeLib = require('../libs/time');
const tokenLib = require('../libs/token');
const logger = require('../libs/logger');
const check = require('../libs/check');
const time = require('../libs/time');
const mail = require('../libs/mail');
const nodemailer = require('nodemailer')
const response = require('/home/sowmya/trackIt/trackItBackEnd/app/libs/response');
const { update } = require('../models/authModel');

let signUpUser = (req,res) => {

    let validateParams = () => {
        console.log('validateParams called')
        return new Promise((resolve, reject) => {
            if (req.body.userEmail) {
                if (!paramsLib.Email(req.body.userEmail)) {
                    let apiResponse = response.generate(true, "Email does not met the requirement", 400, null)
                    reject(apiResponse)
                    console.log(apiResponse)
                } else if (check.isEmpty(req.body.userPassword)) {
                    let apiResponse = response.generate(true, "Password missing", 400, null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                let apiResponse = response.generate(true, "Onr or more parameter(s) missing in the field", 400, null)
                reject(apiResponse)
            }

        })
    }  //end of validateParams function in signup function

    let createUser = () => {
        console.log('createUSer called')
        return new Promise((resolve, reject) => {
            userModel.findOne({userEmail : req.body.userEmail})
            .exec((err, userDetails) => {
                if(err) {
                    logger.error(err, "createUser() in signup function", 10)
                    let apiResponse = response.generate(err, "Error occured in finding user", 404, null)
                    reject(apiResponse)
                } else if(check.isEmpty(userDetails)) {
                    let newUser = new userModel({
                        userId : shortid.generate(),
                        firstName : req.body.firstName,
                        lastName : req.body.lastName,
                        fullName : `${req.body.firstName} ${req.body.lastName}`,
                        userEmail : req.body.userEmail,
                        userPassword : passwordLib.hashPassword(req.body.userPassword),
                        mobileNumber : req.body.mobileNumber,
                    })
                    newUser.save((err, user) => {
                        if(err) {
                            logger.error(err, "createUser() in signup function", 5)
                            let apiResponse = response.generate(true, "User not created", 500, null)
                            reject(apiResponse)
                        } else {
                            logger.info("User created successfully", "createUser() in signup", 10)
                            let userDetailsObj = user.toObject()
                            resolve(userDetailsObj)
                        }
                    })
                } else {
                    logger.error("User cannot be created, as user is already present", "createUser() in signup", 6)
                    let apiResponse = response.generate(true, "User cannot be created, user already present", null)
                    reject(apiResponse)
                }
            })
        })  
    }

    let generateToken = (userDetailsObj) => {
        console.log('generateToken called')
        return new Promise((resolve, reject) => {
            tokenLib.generateJwt(userDetailsObj, (err, tokenDetails) => {
                if(err) {
                    logger.error(err, "generateToken() in signup()", 10)
                    let apiResponse = response.generate(true, "Token generation failed", 500, null)
                    reject(apiResponse)
                } else {
                    logger.info("Token generated successfully", "generateToken() in signup()", 10)
                    tokenDetails.userId = userDetailsObj.userId
                    tokenDetails.userDetails = userDetailsObj
                    resolve(tokenDetails)
                }
            })
        })
    }

    let saveToken = (tokenDetails) => {
        console.log(tokenDetails.userId+" is userId")
        return new Promise((resolve, reject) => {
            authModel.findOne({ userId : tokenDetails.userId})
            .exec((err, foundTokenDetails) => {
                if(err) {
                    logger.error(err, "saveToken() in signup()", 10)
                    let apiResponse = response.generate(true, "Failed to find token details", null)
                    reject(apiResponse)
                } else if(check.isEmpty(foundTokenDetails)) {
                    let newAuthToken = new authModel({
                        userId : tokenDetails.userId,
                        authToken : tokenDetails.token,
                        tokenSecret : tokenDetails.tokenSecret,
                        tokenGenertionTime : time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if(err) {
                            logger.error(err, "saveToken() in signup()", 7)
                            let apiResponse = response.generate(true, "Unable to save token", 500, null)
                            reject(apiResponse)
                        } else {
                            logger.info("Token saved successfully", "saveToken() in singup()", 10)
                            let responseBody = {
                                authToken : newTokenDetails.authToken,
                                userDetails : tokenDetails.userDetails
                            }
                            console.log(responseBody)
                            resolve(responseBody)
                        }
                    })
                } else {
                    foundTokenDetails.authToken = tokenDetails.token
                    foundTokenDetails.userId = tokenDetails.userId
                    foundTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    foundTokenDetails.tokenGenertionTime = tokenDetails.tokenGenertionTime
                    foundTokenDetails.save((err, newTokenDetails) => {
                        if(err) {
                            logger.error(err, "saveToken() in signup()", 5)
                            let apiResponse = response.generate(true, "Unable to save token", 500, null)
                            reject(apiResponse)
                        } else{
                            logger.info("Successfully saved token details", "saveToken() in signup()", 7)
                            let responseBody = {
                                authToken : newTokenDetails.authToken,
                                userDetails : foundTokenDetails.userDetails
                            }
                            console.log(responseBody)
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    } //saveToken() end

    validateParams(req, res)
    .then(createUser)
    .then(generateToken)
    .then(saveToken)
    .then((resolve) => {
        let apiResponse = response.generate(false, "Signup successfull", 200, resolve)
        res.status(200).send(apiResponse)
    })
    .catch((err) => {
        res.send(err)
    })
} //signup() end

//start signInUser()
let signInUser = (req, res) => {

    let findUser = () => {
        //console.log('findUser function is called')
        return new Promise((resolve, reject) => {
            if (req.body.userEmail) {
                //console.log(req.body)
                userModel.findOne({
                        userEmail: req.body.userEmail
                    })
                    .exec((err, userDetails) => {
                        if (err) {
                            logger.error(err, "findUser() in loginFunction()", 10)
                            let apiResponse = response.generate(true, "Failed to find user", 500, null)
                            reject(apiResponse)
                        } else if (check.isEmpty(userDetails)) {
                            let apiResponse = response.generate(true, "No user Found", 404, null)
                            reject(apiResponse)
                        } else {
                            logger.info('User Found', 'userController: findUser()', 10)
                            resolve(userDetails)
                        }
                    })
            } else {
                let apiResponse = response.generate(true, "Email parameter is missing in the body parameter", 400, null)
                reject(apiResponse)
            }

        })
    } //end findUser function

    let validatePasswordInput = (userDetails) => {
        //console.log(retrievedUserDetails + 'retrievedUserDetails is called')
        console.log(userDetails)
        //console.log("validatePasswordInput is called")
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.userPassword, userDetails.userPassword, (err, isMatch) => {
                if (err) {
                    let apiResponse = response.generate(true, "Login failed", 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let founduserDetails = userDetails.toObject()
                    delete founduserDetails.userPassword
                    delete founduserDetails._id
                    delete founduserDetails._v
                    delete founduserDetails.createdOn
                    delete founduserDetails.modifiedOn
                    resolve(founduserDetails)
                } else {
                    logger.error('Login Failed Due To Invalid Password', 'userController: validatePasswordInput')
                    let apiResponse = response.generate(true, "Invalid login password", 400, null)
                    reject(apiResponse)
                }
            })
        })
    } //end validatePasswordInput function

    let generateToken = (founduserDetails) => {
        console.log("Generate token is called")
        return new Promise((resolve, reject) => {
            tokenLib.generateJwt(founduserDetails, (err, tokenDetails) => {
                if (err) {
                    logger.error("Failed to generate token", "generateToken()", 10)
                    let apiResponse = response.generate(true, "Failed to generate token", 500, null)
                    reject(apiResponse)
                } else {
                    logger.info("Successfull", "generateToken()", 10)
                    tokenDetails.userId = founduserDetails.userId;
                    tokenDetails.userDetails = founduserDetails;
                    resolve(tokenDetails)
                }
            })
        })
    } //end generateToken function

    let saveToken = (tokenDetails) => {
        console.log("SaveToken function is called")
        return new Promise((resolve, reject) => {
            authModel.findOne({
                userId: tokenDetails.userId
            }, (err, foundTokenDetails) => {
                if (err) {
                    let apiResponse = response.generate(true, "Failed to find userId", 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(foundTokenDetails)) {
                    let newAuthToken = new authModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenarationTime: time.now(),
                        isAdmin: tokenDetails.isAdmin
                    })
                    newAuthToken.save((err, newToken) => {
                        if (err) {
                            let apiResponse = response.generate(true, "Failed to create new token", 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newToken.authToken,
                                userDetails: tokenDetails.userDetails,
                            }
                            
                            resolve(responseBody)
                            console.log("Token saved")
                        }
                    })
                } else {
                    foundTokenDetails.authToken = tokenDetails.token
                    foundTokenDetails.userId = tokenDetails.userId
                    foundTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    foundTokenDetails.tokenGenarationTime = tokenDetails.tokenGenarationTime
                    foundTokenDetails.isAdmin = tokenDetails.isAdmin

                    foundTokenDetails.save((err, newToken) => {
                        if (err) {
                            let apiResponse = response.generate(true, "Failed to update newToken", 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newToken.authToken,
                                userDetails: tokenDetails.userDetails,

                            }
                            resolve(responseBody)
                            console.log("Token saved")
                        }
                    })

                }
            })
        })
    } //end saveToken function

    findUser(req, res)
        .then(validatePasswordInput)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, "Login successfull", 200, resolve)
            res.status(200)
            res.send(apiResponse)
            //console.log(resolve.authToken)
        })
        .catch((err) => {
            res.send(err)
        })
} //end login function

//start logout function
let logout = (req, res) => {
    console.log(req.user)
    authModel.findOneAndRemove({
        userId: req.user.userId
    }, (err, userDetails) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'logout Function', 10)
            let apiResponse = response.generate(true, `error occurred at: ${err.message}`, 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(userDetails)) {
            let apiResponse = response.generate(true, 'Logged Out or Invalid UserId', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
            res.send(apiResponse)
        }
    })
} //end logout function

let recoveryMail = (req,res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            userModel.findOne({userEmail : req.body.userEmail})
            .exec((err, userDetails) => {
                if (err) {
                    logger.error(err, "findUser() in recoveryMail", 10)
                    let apiResponse = response.generate(true, "Unexpected error occurred in finding user", 404, null)
                    reject(apiResponse)
                } else if (check.isEmpty(userDetails)) {
                    logger.error('No User Found', 'generateToken()', 7)
                    let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info('User Found', 'userController: findUser()', 10)
                    resolve(userDetails)
                }
            })
        })
    }

    let generateRecoveryToken = (userDetails) => {
        //console.log(userDetails)
        return new Promise((resolve, reject) => {
            tokenLib.generateJwt(userDetails, (err, tokenDetails) => {
                if (err) {
                    logger.error(err, "generateRecoveryToken() in recoveryMail()", 7)
                    let apiResponse = response.generate(true, 'Unexpected error occured', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }
    let setRecoveryToken = (tokenDetails) => {
        return new Promise((resolve, reject) => {
            userModel.findOne({ userEmail : req.body.userEmail }, (err, userDetails) => {
                if(err) {
                    logger.error(err.message, "setRecoveryToken() function", 10)
                    let apiResponse = response.generate(true, "Unknown error at setRecoveryToken()", 500, null)
                    reject(apiResponse)
                } else {
                    userDetails.recoveryToken = tokenDetails.token
                    userDetails.save((err, updatedDetails) => {
                        if(err){
                            logger.error(err, "Error at setRecoveryToken()", 7)
                            let apiResponse = response.generate(true, "Unable to save token", 500, null)
                            reject(apiResponse)
                        } else {
                            resolve(updatedDetails)
                            console.log(updatedDetails)
                        }
                    })
                }
            })
        })
    }

    let sendMail = (updatedDetails) => {
        console.log('updated details in sendMail() is '+updatedDetails)
        console.log(updatedDetails.recoveryToken)
        return new Promise((resolve, reject) => {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: appConfig.mailer.user,
                    pass: appConfig.mailer.pass
                }
            })
            let mailOptions = {
                from: appConfig.mailer.user,
                to: updatedDetails.userEmail,
                subject: 'Reset password',
                html: `<h4>Hi ${updatedDetails.fullName}<h4>
                    <p>You are receiving this because you have requested the reset of the password for your account.<br>
                        <br>'Please click on the following link to complete the process.'<br>
                        <br> <a href="http://localhost:4200/resetpassword/${updatedDetails.recoveryToken}">Reset Password</a>
                    </p>
                    <p>
                    <br>If You have'nt initiated this request please ignore<br>
                    <br>Thank you<br>
                    </p>`
            }
            console.log("mailoptions are "+mailOptions)
            transporter.sendMail(mailOptions, (err, info) => {
                if(err) {
                    logger.error(err, "sendMail() in recoveryMail()", 10)
                    let apiResponse = response.generate(true, "Unexpected error occured", 500, null)
                    reject(apiResponse)
                } else {
                    resolve(info)
                }
            })
        })
    }

    findUser(req,res)
    .then(generateRecoveryToken)
    .then(setRecoveryToken)
    .then(sendMail)
    .then((resolve) => {
        let apiResponse = response.generate(false, "Mail sent successfully", 200, resolve)
        res.send(apiResponse)
    })
    .catch((err) => {
        res.send(err)
    })
}

let resetPassword = (req, res) => {
    let findUser = () => {
        //console.log(req.body)
        return new Promise((resolve, reject) => {
            if (req.body.recoveryToken) {
                userModel.findOne({
                    recoveryToken: req.body.recoveryToken
                }, (err, userTokenDetails) => {
                    console.log(userTokenDetails)
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'findUser() in resetPassword()', 10)
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(userTokenDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'findUser() in resetPassword()', 10)
                        resolve(userTokenDetails)
                    }
                })
            } else {
                logger.error("ValidationToken parameter is missing", "findUser() in resetPassword()", 3)
                let apiResponse = response.generate(true, '"validationToken" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let updateResetPassword = (userTokenDetails) => {
        return new Promise((resolve, reject) => {
            let options = {
                userPassword: passwordLib.hashPassword(req.body.userPassword),
                recoveryToken:'Null'
            }
            userModel.updateOne({ 'userId': userTokenDetails.userId }, options).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'updateResetPassword function', 10)
                    let apiResponse = response.generate(true, 'Failed To reset user Password', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.error('No User Found with given Details', 'updateResetPassword function', 7)
                    let apiResponse = response.generate(true, 'No User Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Password Updated successfully', 200, result)
                    resolve(apiResponse)
                }
            })
        })
    }
    findUser(req, res)
    .then(updateResetPassword)
        .then((resolve) => {
            let apiResponse = response.generate(false, "Password reset successful...please login to continue", 200, null)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
}

let getAllUsers = (req, res) => {
    userModel.find()
    .select(' -__v -_id -userPassword')
    .lean()
    .exec((err, result) => {
        if(err) {
            logger.error(err.message, 'getAllUsers() function', 10)
                let apiResponse = response.generate(true, "Failed to find user", 404, null)
                res.send(apiResponse)
        } else if(check.isEmpty(result)) {
            logger.error('No user Found', 'getAllUser', 7)
                let apiResponse = response.generate(true, "No user found", 500, null)
                res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, "All user details found", 200, result)
                res.send(apiResponse)
        }
    })
}

let getAllUsersCount = (req, res) => {
    userModel.count()
    .exec((err, result) => {
        if(err) {
            logger.error(err.message, 'getAllUsersCount() function', 10)
            let apiResponse = response.generate(true, "Failed to retrieve users data", 404, null)
            res.send(apiResponse)
        } else if(check.isEmpty(result)) {
            logger.error('No user found', 'getAllUsersCount() function', 7)
            let apiResponse = response.generate(true, "No user found", 500, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, "Count retrieved of all normal users", 200, result)
            res.send(apiResponse)
        }
    }) 
}

let singleUser = (req,res) => {
    userModel.findOne({
        'userId': req.params.userId
    })
    .select('-userPassword -__v -_id')
    .lean()
    .exec((err, result) => {
        if (err) {
            logger.error(err.message, 'error in singleUser() function', 10)
            let apiResponse = response.generate(true, "Failed to find user", 404, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.error('No user Found', 'singleUser() function', 7)
            let apiResponse = response.generate(true, "No user found", 500, null)
            res.send(apiResponse)
        } else {
            logger.info("User found", "singleUser() function", 10)
            let apiResponse = response.generate(false, "User with specified userId found", 200, result)
            res.send(apiResponse)
        }
    })
}
let SocialUsers = (req, res) => {
    socialModel.find().select('-__v -_id').lean().exec((err, result) => {
        if (err) {
            logger.error(err.message, 'error in SocailUsers() function', 10)
            let apiResponse = response.generate(true, "Failed to find user", 404, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.error('No user Found', 'SocailUsers() function', 7)
            let apiResponse = response.generate(true, "No user found", 500, null)
            res.send(apiResponse)
        } else {
            logger.info("User found", "SocailUsers() function", 10)
            let apiResponse = response.generate(false, "All Social user details found", 200, result)
            res.send(apiResponse)
        }
    })
}

module.exports = {
    signUpUser : signUpUser,
    signInUser : signInUser,
    resetPassword : resetPassword,
    recoveryMail : recoveryMail,
    logout : logout,
    getAllUsers : getAllUsers,
    getAllUsersCount : getAllUsersCount,
    singleUser : singleUser,
    SocialUsers : SocialUsers
}