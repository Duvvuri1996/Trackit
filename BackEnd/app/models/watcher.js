const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Watch = new Schema ({
    watchId : String,

    issueId : String
})

module.exports = mongoose.model('Watch', Watch)