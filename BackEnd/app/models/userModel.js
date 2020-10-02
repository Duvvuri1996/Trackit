const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema ({
    userId : String,

    firstName : String,

    lastName : {
        type : String,
        default : ''
    },

    fullName : String,

    userEmail : String,

    userPassword : String,

    mobileNumber : {
        type : String,
        default : ''
    },
    recoveryToken : {
        type: String,
        default : ''
    },
    
    recoveryTokenExpiration : {
        type : Date,
        default : ''
    }
})

module.exports = mongoose.model('User', User)