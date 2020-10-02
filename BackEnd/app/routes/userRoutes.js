const express = require('express');
const config = require('/home/sowmya/trackIt/trackItBackEnd/config/config');
const auth = require('../middlewares/auth');
const controller = require('../controllers/user');
const passport = require('passport');

module.exports.setRouter = (app) => {

    let baseUrl = `${config.apiVersion}/user`

    app.post(`${baseUrl}/signup`, controller.signUpUser);

    /**
	 * @api {post} /api/v1/user/signup Signup user
	 * @apiVersion 1.0.0
     * @apiGroup users
     * 
	 * @apiParam {String} firstName firstName of the user passed as a body parameter
     * @apiParam {String} lastName lastName of the user passed as a body parameter
     * @apiParam {Number} mobileNumber mobileNumber of the user passed as a body parameter
     * @apiParam {String} userEmail email of the user passed as a body parameter
     * @apiParam {String} userPassword password of the user passed as a body parameter
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Signup successfull.",
	    "status": 200,
	    "data": {
                    authToken : "string"
                    userId: "string", 
                    firstName: "string",
                    lastName: "string",
                    fullName : "string",
                    mobileNumber: "string",
                    userEmail: "string",
                    createdOn: "date"
				}
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.post(`${baseUrl}/signin`, controller.signInUser);

    /**
	 * @api {post} /api/v1/user/signin Signin user
	 * @apiVersion 1.0.0
     * @apiGroup users
     * 
     * @apiParam {String} userEmail email of the user passed as a body parameter
     * @apiParam {String} userPassword password of the user passed as a body parameter
	 * 
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Login successfull.",
	    "status": 200,
	    "data": {
                    authToken: "string",
                    userId: "string",
                    firstName: "string",
                    lastName: "string",
                    fullName : "string",
                    mobileNumber: "string",
                    userEmail: "string",
                    createdOn: "date"
				}
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.post(`${baseUrl}/resetpassword`, controller.resetPassword);

    /**
	 * @api {post} /api/v1/user/resetpassword Reset password
	 * @apiVersion 1.0.0
     * @apiGroup users
     * 
     * @apiParam {String} recoveryToken as body parameter
     * @apiParam {String} userPassword userPassword of the user passed as body parameter
	 *
     * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Password set successfully",
	    "status": 200,
	    "data": "Password set successfully"
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.post(`${baseUrl}/recoverymail`, controller.recoveryMail);

    /**
	 * @api {post} /api/v1/user/recoverymail Recoverymail to reset password
	 * @apiVersion 1.0.0
     * @apiGroup users
     * 
     * @apiParam {String} userEmail userEmail of the user passed as body parameter
	 *
     * 
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Email sent successfully.",
	    "status": 200,
	    "data": "Please check your email"
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.post(`${baseUrl}/logout`,auth.isAuthorized, controller.logout);

    /**
	 * @api {post} /api/v1/user/logout Logout normal user
	 * @apiVersion 1.0.0
     * @apiGroup users
     * 
     * @apiParam {String} authToken The token for authentication for normal login users.(Send authToken as query parameter, body parameter or as a header)
	 * 
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Logout successfull.",
	    "status": 200,
	    "data": null
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.get(`${baseUrl}/allusers`, controller.getAllUsers);

    /**
	 * @api {get} /api/v1/user/allusers Get all users
	 * @apiVersion 1.0.0
	 * @apiGroup users
	 *
	 * @apiSuccessExample {json} Success-Response:
	 * {
	    "error": false,
	    "message": "All User Details Found",
	    "status": 200,
	    "data": [
					{
						userId: "string",
                        firstName: "string",
                        lastName: "string",
                        fullName : "string",
                        mobileNumber: "string",
                        email: "string",
                        createdOn: "date"
					}
	    		]
	    	}
		}
	}
	 @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Find User Details",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.get(`${baseUrl}/alluserscount`, controller.getAllUsersCount);

    /**
	 * @api {get} /api/v1/user/alluserscount Get count of all Normal users users
	 * @apiVersion 1.0.0
	 * @apiGroup users
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "All  Users count Found",
	    "status": 200,
	    "data": "number"
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To get count of all Users",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.get(`${baseUrl}/singleuser/:userId`, controller.singleUser);



    app.get(`${baseUrl}/allSocialUsers`, controller.SocialUsers);

    /**
	 * @api {get} /api/v1/user/allSocialUsers Get all social users
	 * @apiVersion 1.0.0
	 * @apiGroup users
	 *
	 * @apiSuccessExample {json} Success-Response:
	 * {
	    "error": false,
	    "message": "All User Details Found",
	    "status": 200,
	    "data": [
					{
						userId: "string",
                        firstName: "string",
                        lastName: "string",
                        email: "string",
                        createdOn: "date"
					}
	    		]
	    	}
		}
	}
	 @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Find User Details",
	    "status": 404/500,
	    "data": null
	   }
	 */

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}));



    app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
        let responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
         responseHTML = responseHTML.replace('%value%', JSON.stringify({
        user: req.user
    }));
    res.status(200).send(responseHTML)
    })

    app.get('/api/current_user', (req, res) => {
        res.send(req.user)
    })

    app.get('/api/logout', (req, res) => {
        res.send(req.logout())
    })

    /**
	 * @api {get} /api/logout Logout social login user
	 * @apiVersion 1.0.0
     * @apiGroup users
     * 
     * 
	 * 
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Logout successfull.",
	    "status": 200,
	    "data": null
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 404/500,
	    "data": null
	   }
	 */
    


}