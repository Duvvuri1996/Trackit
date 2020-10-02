const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocialUser = new Schema ({
    userId : {
        type: String,
        default: '',
        unique : true,
        index: true
    },
    firstName : {
        type: String,
        defualt : ''
    },
    lastName : {
        type: String,
        default : ''
    },
    email : {
        type: String,
        default : ''
    },
    createdOn : {
        type: Date,
        default: ''
    }
})

module.exports = mongoose.model('SocialUser', SocialUser)