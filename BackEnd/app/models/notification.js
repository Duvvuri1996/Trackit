const mongoose = require('mongoose');
const Schema = mongoose.Schema;;
const time = require('../libs/time');

let today = time.now();

let notification = new Schema({
    userId : String,
    notificationCount : {
        type : Number,
        default : 0
    },
    notificationDescription : {
        type : [String],
        default : ''
    },
    issueId : String,
    createdOn : {
        type : Date,
        default : ''
    }
})

module.exports = mongoose.model('Notification', notification);