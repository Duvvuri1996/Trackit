const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const time = require('../libs/time');

const Auth = new Schema({
    userId : String,
    authToken:String,
    tokenSecret:String,
    tokenGenerationTime:String
})

module.exports = mongoose.model('Auth', Auth)