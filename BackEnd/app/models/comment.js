const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const Comment = new Schema ({
    
    commentId : String,

    reporterId : String,
     
    reporterName : String,

    issueId : String,

    comment : {
        type : String,
        default : 'No comment'
    },

    createdOn : {
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model('Comment', Comment)