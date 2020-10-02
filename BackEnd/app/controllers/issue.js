const mongoose = require('mongoose');
const shortid = require('shortid');
const authModel = require('../models/authModel');
const userModel = mongoose.model('User')
const socialModel = require('../models/socialUserModel');
const issueModel = require('../models/issueModel');
const commentModel = require('../models/comment');
const watcherModel = require('../models/watcher');
const paramsLib = require('../libs/params');
const passwordLib = require('../libs/password');
const timeLib = require('../libs/time');
const tokenLib = require('../libs/token');
const logger = require('../libs/logger');
const check = require('../libs/check');
const time = require('../libs/time');
const mail = require('../libs/mail');
const nodemailer = require('nodemailer');
const response = require('../libs/response');
const notification = require('../models/notification');


let createIssue = (req, res) => {
    let today = new Date()
    let newIssue = new issueModel({
        issueId : shortid.generate(),
        userId : req.body.userId,
        assigneeId : req.body.assigneeId,
        userName : req.body.userName,
        assigneeName : req.body.assigneeName,
        issueTitle : req.body.issueTitle,
        issueDescription : req.body.issueDescription,
        status : req.body.status,
        createdOn : new Date(),
    })
    if(req.body.images) {
        newIssue.images = req.body.images.split(',')
    } else {
        newIssue.images = []
    }
//    newIssue.total_count += 1
    newIssue.save((err, result) => {
        if (err) {
            logger.error(err.message, "createIssue() function", 10)
            let apiResponse = response.generate(true, "Failed to create event", 404, null)
            res.send(apiResponse)
        } else {
            let data = new notification({
                issueId : result.issueId,
                notificationDescription : "Your Issue has been created successfully",
                userId : result.userId,
                createdOn : time.now(),
                notificationCount : 1
            })
            
            data.save()
            console.log(data)
            let data1 = new notification({
                issueId : result.issueId,
                notificationDescription : `Hey ${result.assigneeName}, new issue has been assigned to you by ${result.userName}`,
                userId : result.assigneeId,
                createdOn : time.now(),
                notificationCount : 1
            })
            
            data1.save()
            console.log(result)
           logger.info("Issue created successfully", "createIssue() function", 10)
           let apiResponse = response.generate(false, "Issue creeated succesfully", 200, result)
           res.send(apiResponse)
        }
    })
}

let deleteIssue = (req, res) => {
    issueModel.findOneAndDelete({issueId : req.params.issueId})
    .exec((err, result) => {
        if(err) {
            logger.error(err.message, "deleteIssue() function", 10)
            let apiResponse = response.generate(true, "Unknown error occured", 500, null)
            res.send(apiResponse)
        } else {
            logger.info("Issue deleted successfully", "deleteIssue() function", 10)
            let apiResponse = response.generate(false, "Issue deleted successfully", 200, "deleted")
            res.send(apiResponse)
        }
    })
}

let editIssue = (req, res) => {
    let options = req.body
    issueModel.updateOne({ issueId : req.params.issueId}, options)
    .exec((err, details) => {
        if(err) {
            logger.error(err.message, "Error occured at editIssue() function", 10)
            let apiResponse = response.generate(true, "Unknown error occurred", 500, null)
            res.send(apiResponse)
        } else if(check.isEmpty(details)) {
            logger.error("No issue found to update", "Error occured at editIssue() function", 7)
            let apiResponse = response.generate(true, "No issue found to update", 404, null)
            res.send(apiResponse)
        } else {
            details.modifiedOn = new Date()
            delete details.n
            delete details.nModified
            delete details.ok

            let options = {
                $push:{
                    notificationDescription : "Someone edited the issue following by you",
                    notificationCount  : 1
                }
            }
            
            notification.updateMany({ issueId : req.params.issueId }, options)
            logger.info("Issue updated successfully", "Success at editIssue() function", 10)
            let apiResponse = response.generate(false, "Issue updated successfully", 200, details)
            res.send(apiResponse)
        }
    })
}

let getAllIssues = (req, res) => {
    issueModel.find()
    .lean()
    .exec((err, allIssues) => {
        if(err) {
            logger.error(err.message, "Error occured at getAllIssues() function", 10)
            let apiResponse = response.generate(true, "Unknown error occured", 500, null)
            res.send(apiResponse)
        } else if(check.isEmpty(allIssues)) {
            logger.error("No issues found", "at getAllIssues() function", 7)
            let apiResponse = response.generate(true, "No issues found", 404, null)
            res.send(apiResponse)   
        } else {
            logger.info("All issues found", "at getAllIssues() function", 10)
            let apiResponse = response.generate(false, "All issues found", 200, allIssues)
            res.send(apiResponse)
        }
    })
}

let singleIssue = (req, res) => {
    issueModel.findOne({issueId : req.params.issueId})
    .exec((err, issueDetails) => {
        if(err) {
            logger.error(err.message, "Error occurred at singleIssue() function", 10)
            let apiResponse = resposne.generate(true, "Unknown error occured", 500, null)
            res.send(apiResponse)
            console.log('getAllIssuesCount in  singleissue')
        } else if(check.isEmpty(issueDetails)) {
            logger.error("issueDetails are empty", "error at singleIssue() function", 7)
            let apiResponse = response.generate(true, "issueDetails are empty", 404, null)
            res.send(apiResponse)
            console.log('getAllIssuesCount in  singleissue')
        } else {
            logger.info("Issue found successfully", "at singleIssue() function", 10)
            let apiResponse = response.generate(false, "Issue found successfully", 200, issueDetails)
            res.send(apiResponse)
            console.log('getAllIssuesCount in  singleissue')
        }
    })
}

let getAllIssuesByuserId = (req, res) => {
    issueModel.findOne({userId : req.params.userId})
    .exec((err, issueDetails) => {
        if(err) {
            logger.error(err.message, "Error occurred at getAllIssuesByuserId() function", 10)
            let apiResponse = response.generate(true, "Unknown error occured", 500, null)
            res.send(apiResponse)
        } else if(check.isEmpty(issueDetails)) {
            logger.error("issueDetails are empty", "at getAllIssuesByuserId() function",7)
            let apiResponse = response.generate(true, "issueDetails are empty", 404, null)
            res.send(apiResponse)
        } else {
            logger.info("Details found successfully", "at getAllIssuesByuserId() function", 10)
            let apiResponse = response.generate(false, "Details found successfully", 200, issueDetails)
            res.send(apiResponse)
        }
    })
}

let getAllIssuesByassineeId = (req, res) => {
    issueModel.findOne({assigneeId : reqq.params.assigneeId})
    .exec((err, issueDetails) => {
        if(err) {
            logger.error(err.message, "Error occurred at getAllIssuesByassineeId() function", 10)
            let apiResponse = response.generate(true, "Unknown error occured", 500, null)
            res.send(apiResponse)
        } else if(check.isEmpty(issueDetails)) {
            logger.error("issueDetails are empty", "at getAllIssuesByassineeId() function",7)
            let apiResponse = response.generate(true, "issueDetails are empty", 404, null)
            res.send(apiResponse)
        } else {
            logger.info("Details found successfully", "at getAllIssuesByassineeId() function", 10)
            let apiResponse = response.generate(false, "Details found successfully", 200, issueDetails)
            res.send(apiResponse)
        }
    })
}

let watchIssue = (req, res) => {

    watcherModel.find({ issueId : req.body.issueId, watchId : req.body.watchId }).exec((err, details) => {
    if(err){
        logger.error(err, "At watchIssue() function", 10)
        let apiResponse = response.generate(err.message, "Unknown error occured ", 500, null)
        res.send(apiResponse) 
    }else if(details) {
        logger.info("User already in watch list", "at watchIssue() function", 10)
        let apiResponse = response.generate(true, "User already under watch list...cannot be added", 404, details)
        res.send(apiResponse)
    } else {
        let newWatch = new watcherModel({
            issueId : req.body.issueId,
            watchId : req.body.watchId
        })
        console.log(req.body.watchId)
        console.log(req.body.issueId+ " issue")
        newWatch.save((err, result) => {
            if(err) {
                logger.error(err.message, "Error occurred at watchIssue() function", 10)
                let apiResponse = response.generate(true, "Unknown error occured", 500, null)
                res.send(apiResponse)
            } else {
                delete result._id
                delete result.__v
                console.log(result.watchId)
                let data = new notification({
                    issueId : result.issueId,
                    userId : result.watchId,
                    notificationDescription : "You are added to the watch list...You will get notifications regarding this issue",
                    createdOn : time.now(),
                    notificationCount : 1
                })
                
                data.save()
                logger.info("Successfully created watch", "at watchIssue() function", 10)
                let apiResponse = response.generate(false, "Successfully created watchIssue", 200, result)
                res.send(apiResponse)
            }
        })
    }
    })
}

let deleteWatch = (req, res) => {
    watcherModel.findOneAndDelete({ issueId : req.body.issueid, watchId : req.body.watchId }).exec((err, result) => {
        if(err) {
            logger.error(err, "Unknown error occurred at delete() Function", 10)
            let apiResponse = response.generate(true, "Unknown error occured at delete() watcherFunction", 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)){
            let apiResponse = response.generate(true, "User not part of watch lis")
            res.send(apiResponse)
            console.log(result)
        } 
        else {
            let apiResponse = response.generate(false, "At delete() watcher function", 200, null)
            res.send(apiResponse)
        }
    })
}

let watchCount = (req, res) => {
    watcherModel.countDocuments({ issueId : req.params.issueId })
    .exec((err, count) => {
        if(err) {
            logger.error(err.message, "Error occurred at watchCount() function", 10)
            let apiResponse = response.generate(true, "Unknown error occured", 500, null)
            res.send(apiResponse)
        } else {
            logger.info("Successfully retrieved count", "at watchCount() function", 10)
            let apiResponse = response.generate(false, "Successfully retrieved count", 200, count)
            res.send(apiResponse)
        }
    })
}

let allWatchOfUser = (req, res) => {
    watcherModel.find({ watchId : req.params.watchId })
    .exec((err, allDetails) => {
        if(err) {
            logger.error(err.message, "Error occurred at allWatchOfUser() function", 10)
            let apiResponse = response.generate(true, "Unknown error occured", 500, null)
            res.send(apiResponse)
        }
        else if(check.isEmpty(allDetails)) {
            logger.error("allDetails are empty", "at getAllIssuesByassineeId() function",7)
            let apiResponse = response.generate(true, "issueDetails are empty", 404, null)
            res.send(apiResponse)
        } else {
            logger.info("All details found", "at allWatchOfUser() function", 10)
            let apiResponse = response.generate(false, "All details found", 200, allDetails)
            res.send(apiResponse)
        }
    })
}

let searchIssue = (req, res) => {
    issueModel.find({ $text : { $search : req.body.search } }).limit(10).exec((err, docs) => {
        if(err) {
            logger.error(err.message, "Error occured at searchIssue() function", 10)
            let apiResponse = response.generate(true, "Unknown error occured", 500, null)
            res.send(apiResponse)
        } else if(check.isEmpty(docs)) {
            logger.error("No results found", "at searchIssue() function", 7)
            let apiResponse = response.generate(true, "No results found", 404, null)
            res.send(apiResponse)
        } else {
            logger.info("Docs found", "at searchIssue() function", 10)
            let apiResponse = response.generate(false, "Docs found", 200, docs)
            res.send(apiResponse)
        }
    })
}

let createComment = (req, res) => {
    let newComment = new commentModel({
        commentId : shortid.generate(),
        reporterId : req.body.reporterId,
        reporterName : req.body.reporterName,
        issueId : req.body.issueId,
        comment : req.body.comment,
        createdOn : timeLib.now()
    })
    newComment.save((err, result) => {
        if(err) {
            logger.error(err.message, "Error occured at createComment() function", 10)
            let apiResponse = response.generate(true, "Unknown error occured", 500, null)
            res.send(apiResponse)
        } else {
            let options = {
                $push:{
                    notificationDescription : "Someone commented on the issue following by you",
                    notificationCount : 1
                }
            }
            
            notification.updateMany({ issueId : req.body.issueId }, options)
            logger.info("Comment created successfully", "at createComment() function", 10)
            let apiResponse = response.generate(false, "Comment created successfully", 200, result)
            res.send(apiResponse)
        }
    })
}

let editComment = (req, res) => {
    commentModel.findOne({ commentId : req.params.commentId })
    .exec((err, details) => {
        if(err) {
            logger.error(err.message, "Error occured at editComment() function", 10)
            let apiResponse = response.generate(true, "Unknown error occured in finding comment", 500, null)
            res.send(apiResponse)
        } else {
            if(req.body.comment){
                commentModel.updateOne({ comment : req.body.comment })
            .exec((err, result) => {
                if(err) {
                    logger.error(err.message, "Error occured at editComment() function", 7)
                    let apiResponse = response.generate(true, "Unknown error occured in updating comment", 500, null)
                    res.send(apiResponse)
                } else {
                    logger.info("Successfully updated comment", "at editComment() function", 10)
                    let apiResponse = response.generate(false, "Successfully updated comment", 200, result)
                    res.send(apiResponse)
                }
            })
            } else {
                let apiResponse = response.generate(true, "Cannot edit other than comment section", 500, null)
                res.send(apiResponse)
            }
            
        }
    })
}

let deleteComment = (req, res) => {
    commentModel.deleteOne({ commentId : req.params.commentId })
    .exec((err, result) => {
        if(err) {
            logger.error(err.message, "Error occured at deleteComment() function", 7)
            let apiResponse = response.generate(true, "Unknown error occured in deleteing comment", 500, null)
            res.send(apiResponse)
        } else {
            logger.info("Successfully deleted comment", "at deleteComment() function", 10)
            let apiResponse = response.generate(false, "Successfully deleted comment", 200, null)
            res.send(apiResponse)
        }
    })
}

let deleteNotification = (req, res) => {
    notification.findOneAndDelete({ userId : req.body.userId }, (err, result) => {
        if(err){
            res.send(err)
        } else {
            res.send('Deleted')
        }
    })
}

let getAllComments = (req, res) => {
    commentModel.find({ issueId : req.params.issueId })
    .exec((err, commentDetails) => {
        if(err) {
            logger.error(err.message, "Error occured at getAllComments() function", 7)
            let apiResponse = response.generate(true, "Unknown error occured", 500, null)
            res.send(apiResponse)
        } else if(check.isEmpty(commentDetails)) {    
                logger.error("Details are empty", "at getAllComments() function", 7)
                let apiResponse = response.generate(true, "Details are empty", 404, null)
                res.send(apiResponse)
        } else {
            logger.info("All details found", "at getAllComments() function", 10)
            let apiResponse = response.generate(false, "All details found successfully", 200, commentDetails)
            res.send(apiResponse)
        }
    })
}

let numOfDays = (req, res) => {
    issueModel.findOne({ issueId : req.body.issueId }, (err, details) => {
        if(err) {
            logger.error(err.message, "Error occured at numOfDays() function", 7)
            let apiResponse = response.generate(true, "Unknown error occured", 500, null)
            res.send(apiResponse)
        }else {
            console.log(details+" not")
            //console.log(details.createdOn)
            if(details.createdOn) {
                let date1 = details.createdOn
                let date2 = new Date()
                function diff(d1, d2) {
                    return Math.round((d2-d1)/(1000*60*60*24))
                }
                if(date2.getDate() > date1.getDate()){
                    let numDays = diff(date1, date2)
                    let apiResponse = response.generate(false, "NumDays in days", 200, numDays)
                    res.send(apiResponse)
                    
                } else {
                    let hours1 = date1.getHours()
                    let hours2 = date2.getHours()
                    if(hours2 > hours1){
                        let numDays = (hours2-hours1)+1
                        let apiResponse = response.generate(false, "NumDays in hours", 200, numDays)
                        res.send(apiResponse)
                    } else {
                        let minutes1 = date1.getMinutes()
                        let minutes2 = date2.getMinutes()
                        let numDays = minutes2-minutes1
                        let apiResponse = response.generate(false, "NumDays in minutes", 200, numDays)
                        res.send(apiResponse)
                    }

                }
            } else {
                logger.error("CreatedOn doesnot exists", "at numDays()", 3)
                let apiResponse = response.generate(true, "CreatedOn doesnot exists", 404, null)
                res.send(apiResponse)
            }
        }
    })
}
let countUpdate = (req, res)=>{
    
    notification.updateMany({'userId': req.body.userId}).exec((err, result) => {
        if(err){
            let apiResponse = response.generate(true, 'Failed To Find Notification Details', 500, null)
            res.send(apiResponse)
        }else{
            let apiResponse = response.generate(false, 'All Notification count updated', 200, result)
            res.send(apiResponse)
            console.log(result)
        }
    })
}


let getNotifications = (req, res) => {
    notification.find({ 'userId' : req.params.userId }, (err, notifications) => {
        if(err) {
            logger.error(err, "Error at getNotifications() function", 10)
            let apiResponse = response.generate(true, "Error occured", 500, null)
            res.send(apiResponse)
        } else if(check.isEmpty(notifications)) {
            logger.info('No notifications found', 'at getNotifications() function', 7)
            let apiResponse = response.generate(true, "No notification details found",404, null)
            res.send(apiResponse)
        }
            else {
            logger.info('Notifications found', 'Successfull at getNotifications() function', 10)
            let apiResponse = response.generate(false, "Succesfully found all notification details", 200, notifications)
            console.log(notifications)
            res.send(apiResponse)
        }
    })
}

let getAllIssuesCount = (req, res) => {
    issueModel.countDocuments({})
    .exec((err, result) =>{
        if(err){
            logger.error(err.message, "Error occured at getAllIssuesCount() function", 10)
            let apiResponse = response.generate(true, "Unknown error occured", 500, null)
            res.send(apiResponse)
            
        } else if(result === 0) {
            logger.error("No issues found", "at getAllIssuesCount() function", 7)
            let apiResponse = response.generate(true, "No issues found", 404, null)
            res.send(apiResponse)
          
        } else {
            logger.info("Count of all Issues found", "at getAllIssuesCount() function", 10)
            let apiResponse = response.generate(false, "Count of all issues", 200, result)
            res.send(apiResponse)
            
        }
        
    })
}

let removeWatchersOnIssue = (req, res) => {
        watcherModel.deleteMany({issueId: req.params.issueId})
        .exec((err, result) => {
            if(err) {
                let apiResponse = response.generate(true, "Couldn't remove watchers on the issue", 500, null);
                res.send(apiResponse);
            } else if(check.isEmpty(result)) {
                let apiResponse = response.generate(true, "Details are empty with no watcher", 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(true, "Deleted successfully all watchers", 200, null)
                res.send(apiResponse)
            }
        })
}



module.exports = {
    createIssue : createIssue,
    deleteIssue : deleteIssue,
    editIssue : editIssue,
    getAllIssues : getAllIssues,
    singleIssue : singleIssue,
    getAllIssuesByuserId : getAllIssuesByuserId,
    getAllIssuesByassineeId : getAllIssuesByassineeId,   
    watchIssue : watchIssue,
    watchCount : watchCount,
    allWatchOfUser : allWatchOfUser,
    searchIssue : searchIssue,
    createComment : createComment,
    deleteComment : deleteComment,
    editComment : editComment,
    getAllComments : getAllComments,
    numOfDays : numOfDays,
    countUpdate : countUpdate,
    deleteNotification : deleteNotification,
    getNotifications : getNotifications,
    //getAllIssuesCount : getAllIssuesCount
    removeWatchersOnIssue : removeWatchersOnIssue,
    deleteWatch : deleteWatch
}