const express = require('express');
const mongoose = require('mongoose');
const config = require('/home/sowmya/trackIt/trackItBackEnd/config/config');
const auth = require('../middlewares/auth');
const controller = require('/home/sowmya/trackIt/trackItBackEnd/app/controllers/issue');
const multer = require('/home/sowmya/trackIt/trackItBackEnd/app/multer/multer')
const Grid = require('gridfs-stream');
const passport = require('passport');
const { base } = require('../models/comment');
let connection = mongoose.createConnection(config.db.uri)
let gfs
connection.once('open', function() {
    gfs = Grid(connection.db, mongoose.mongo)
    gfs.collection('uploads')
})

module.exports.setRouter = (app) => {

    let baseUrl = `${config.apiVersion}/issue`

    app.post(`${baseUrl}/create`, controller.createIssue);

    /**
	 * @api {post} /api/v1/issue/create Create an issue
	 * @apiVersion 1.0.0
	 * @apiGroup issue
	 * 
	 * 
	 * @apiParam {String} issuetTitle issuetTitle of the issue passed as a body parameter
	 * @apiParam {String} userId userId of the reporter passed as a body parameter
	 * @apiParam {Date} issueDescription issueDescription of the issue passed as a body parameter
	 * @apiParam {string} status status of the issue passed as a body parameter
	 * @apiParam {string} userEmail userEmail of the user passed as a body parameter
	 * @apiParam {String} userName userName of the user as body parameter
	 * @apiParam {String} assigneeId assigneeId of the user as body parameter
	 * @apiParam {String} assigneeName assigneeName of the user passed as body parameter
	 * @apiParam {string } images images of the issue passed as body parameter
     * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Issue created successfully",
	    "status": 200,
	    "data": [
					{
						issueId: "string",
                        issueTitle: "string",
						userId: "string",
						userName : "string",
						assigneeeId : "string",
						assigneeName : "string",
                        images : [],
                        endDate: : "Date",
                        createdOn:  : "Date",
						modifiedOn : "Date",
						issueDescription : "string",
						status : "string"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To create issue",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.post(`${baseUrl}/delete/:issueId`, controller.deleteIssue);

    /**
	 * @api {post} /api/v1/issue/delete/:issueId Delete issue
	 * @apiVersion 1.0.0
     * @apiGroup issue
     * 
     * 
	 * @apiParam {String} issueId The issueId passed as URL parameter
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Deleted successfully.",
	    "status": 200,
	    "data": null
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured while deleting issue.",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.put(`${baseUrl}/edit/:issueId`, controller.editIssue);

    /**
	 * @api {put} /api/v1/issue/edit/:issueId Edit an issue
	 * @apiVersion 1.0.0
	 * @apiGroup issue
	 * 
	 * 
	 * @apiParam {String} issueId issueId of the issue passed as the URL parameter
	 * 
	 * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Issue edited successfully",
	    "status": 200,
	    "data": [
					{
						issueId: "string",
                        issueTitle: "string",
						userId: "string",
						userName : "string",
						assigneeeId : "string",
						assigneeName : "string",
                        images : [],
                        endDate: : "Date",
                        createdOn:  : "Date",
						modifiedOn : "Date",
						issueDescription : "string",
						status : "string"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed to edit issue",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.get(`${baseUrl}/allIssues`, controller.getAllIssues);

    /**
	 * @api {get} /api/v1/issue/allIssues Get all issues
	 * @apiVersion 1.0.0
	 * @apiGroup issues
	 *
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "All Issues Details Found",
	    "status": 200,
	    "data": [
					{
						issueId: "string",
                        issueTitle: "string",
						userId: "string",
						userName : "string",
						assigneeeId : "string",
						assigneeName : "string",
                        images : [],
                        endDate: : "Date",
                        createdOn:  : "Date",
						modifiedOn : "Date",
						issueDescription : "string",
						status : "string"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Find Issue Details",
	    "status": 404/500,
	    "data": null
	   }
	*/

    //app.get(`${baseUrl}/:issueId`, controller.singleIssue);

    app.get(`${baseUrl}/singleissue/:issueId`, controller.singleIssue);

    /**
	 * @api {get} /api/v1/issue/singleissue/:issueId Get all issues of a single user
	 * @apiVersion 1.0.0
	 * @apiGroup issues
	 *
	 * @apiParam {String} issueId issueId of user as URL parameter
	 * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Issue Details",
	    "status": 200,
	    "data": [
					{
						issueId: "string",
                        issueTitle: "string",
						userId: "string",
						userName : "string",
						assigneeeId : "string",
						assigneeName : "string",
                        images : [],
                        endDate: : "Date",
                        createdOn:  : "Date",
						modifiedOn : "Date",
						issueDescription : "string",
						status : "string"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Find Issue Details",
	    "status": 404/500,
	    "data": null
	   }
	 */

    //app.get(`${baseUrl}/userid/:userId`, controller.getAllIssuesByuserId);
    

    //app.get(`${baseUrl}/assigneeid/:assigneeId`, controller.getAllIssuesByassineeId);

    app.post(`${baseUrl}/watch`, controller.watchIssue);

    /**
	 * @api {post} /api/v1/issue/watch Post a watch
	 * @apiVersion 1.0.0
	 * @apiGroup watch
	 * 
	 * @apiParam {String} issueId issueId of the issues as body parameter
	 * @apiParam {String} watchId userId passed as watchId as body parameter
	 * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Watch created successfully",
	    "status": 200,
	    "data": [
					{
						issueId: "string",
						watchId: "string"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To post watch",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.get(`${baseUrl}/watchcount/:issueId`, controller.watchCount);

    /**
	 * @api {get} /api/v1/issue/watchcount/:issueId Count watch details
	 * @apiVersion 1.0.0
	 * @apiGroup watch
	 * 
	 * @apiParam {String} issueId issueId of the issue passed as URL parameter
	 * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Watch details retrieved successfully",
	    "status": 200,
	    "data": [
					"count": "Number"
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed to count watch details of user",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.get(`${baseUrl}/watchofuser/:userId`, controller.allWatchOfUser);

    /**
	 * @api {get} /api/v1/issue/watchofuser/:userId Watch list of user
	 * @apiVersion 1.0.0
	 * @apiGroup watch
	 * 
	 * @apiParam {String} watchId userId of the user passed as URL parameter
	 * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Watch details retrieved successfully",
	    "status": 200,
	    "data": [
					issueId: "string",
					watchId: "string"
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed to finde watch details of user",
	    "status": 404/500,
	    "data": null
	   }
	 */

    //app.post(`${baseUrl}/assignee/:issueId`, controller.addAssignee);

    app.post(`${baseUrl}/search`, controller.searchIssue);

    /**
	 * @api {post} /api/v1/issue/search Search Issue
	 * @apiVersion 1.0.0
	 * @apiGroup searchIssue
	 * 
	 * @apiParam {String} search search  passed as body parameter
	 * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Docs Found",
	    "status": 200,
	    "data": [
					{
						issueId: "string",
                        issueTitle: "string",
						userId: "string",
						userName : "string",
						assigneeeId : "string",
						assigneeName : "string",
                        images : [],
                        endDate: : "Date",
                        createdOn:  : "Date",
						modifiedOn : "Date",
						issueDescription : "string",
						status : "string"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed to find docs",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.post(`${baseUrl}/createcomment`, controller.createComment);

    /**
	 * @api {post} /api/v1/issue/createcomment Create comment
	 * @apiVersion 1.0.0
	 * @apiGroup Comment
	 * 
	 * 
	 * @apiParam {String} comment comment  passed as a body parameter
	 * @apiParam {String} reporterId userId of the user passed as a body parameter
	 * @apiParam {Date} reporterName userName of the user passed as a body parameter
	 * @apiParam {String} issueId issueId of the issue passed as body parameter
	 * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Comment created successfully",
	    "status": 200,
	    "data": [
					{
						commentId: "string",
                        comment: "string",
						reporterId: "string",
						reporterName : "string",
						creatorId : "string",
						issueId : "string"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To post comment",
	    "status": 404/500,
	    "data": null
	   }
	 */

    //app.put(`${baseUrl}/editcomment/:commentId`, controller.editComment);

    app.post(`${baseUrl}/deletecomment/:commentId`, controller.deleteComment);

    /**
	 * @api {post} /api/v1/issue/deletecomment/:commentId Delete comment
	 * @apiVersion 1.0.0
	 * @apiGroup Comment
	 * 
	 * 
	 * @apiParam {String} commentId commentId  passed as a URL parameter
	 * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Comment deleted successfully",
	    "status": 200,
	    "data": "null"
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To delete comment",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.get(`${baseUrl}/comments/:issueId`, controller.getAllComments);

    /**
	 * @api {get} /api/v1/issue/comments/:issueId get all comments
	 * @apiVersion 1.0.0
	 * @apiGroup Comment
	 * 
	 * 
	 * @apiParam {String} issueId issueId  passed as a URL parameter
	 * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "All comments found",
	    "status": 200,
	    "data": [
					{
						commentId: "string",
                        comment: "string",
						reporterId: "string",
						reporterName : "string",
						creatorId : "string",
						issueId : "string"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To find comments",
	    "status": 404/500,
	    "data": null
	   }
	 */

    //app.get(`${baseUrl}/:eventId/status`, controller.status);

    //app.post(`${baseUrl}/numOfDays`, controller.numOfDays);

    //app.get(`${baseUrl}/comments/:issueId/:userId`, controller.commentsOfUser);

    app.post(`${baseUrl}/uploads`, multer.upload.single('file'), multer.uploadFile);

    app.get(`${baseUrl}/allfiles`, multer.getAllFiles);

    app.get(`${baseUrl}/file/:filename`, multer.getSingleFile);

    app.get(`${baseUrl}/downloadFile/:filename`, multer.downloadFile);

    app.post(`${baseUrl}/deleteFile/:id`, multer.deleteFile);

    app.get(`${baseUrl}/notification/:userId`, controller.getNotifications);

    /**
	 * @api {get} /api/v1/issue/notification/:userId Get all notifications
	 * @apiVersion 1.0.0
	 * @apiGroup notifications
	 *
	 * @apiParam {String} userId userId of the user passed as URL parameter
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "All notification details found",
	    "status": 200,
	    "data": [
					{
						userId: "string",
                        notificationCount: "string",
						notificationDescription: "string",
						issueId : "string",
						creatorId : "string",
                        createdOn:  : "Date"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "No notification details found",
	    "status": 404/500,
	    "data": null
	   }
	*/

    app.post(`${baseUrl}/notifycount`, controller.countUpdate);

    /**
	 * @api {post} /api/v1/issue/notifycount Get count of notifications
	 * @apiVersion 1.0.0
	 * @apiGroup notifications
	 *
	 * @apiParam {String} userId userId of the user passed as body parameter
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "All notification details found",
	    "status": 200,
	    "data": "count"
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To get count of notification details",
	    "status": 404/500,
	    "data": null
	   }
	*/

    app.post(`${baseUrl}/removeWatchersOnIssue/:issueId`, controller.removeWatchersOnIssue);

    /**
	 * @api {post} /api/v1/issue/removeWatchersOnIssue/:issueId delete watcherlist of an issue
	 * @apiVersion 1.0.0
	 * @apiGroup notifications
	 *
	 * @apiParam {String} issueId issueId of the issue passed as URL parameter
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Removed successfully",
	    "status": 200,
	    "data": "null"
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed to remove watcher",
	    "status": 404/500,
	    "data": null
	   }
	*/

    app.post(`${baseUrl}/deleteWatch`, controller.deleteWatch);

    /**
	 * @api {post} /api/v1/issue/deleteWatch delete watcher
	 * @apiVersion 1.0.0
	 * @apiGroup notifications
	 *
	 * @apiParam {String} issueId issueId of the issue passed as body parameter
	 * @apiParam {String} userId issueId of the user passed as body parameter
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Removed successfully from watch",
	    "status": 200,
	    "data": "null"
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed to remove from watch list",
	    "status": 404/500,
	    "data": null
	   }
	*/

    //app.get(`${baseUrl}/getallissuescount`, controller.getAllIssuesCount);
}