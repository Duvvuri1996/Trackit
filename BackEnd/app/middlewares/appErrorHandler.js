const response = require('../libs/response')

let errorHandler = (err, req, res, next) => {
    console.log("errorHandler called")
    console.log(err)
    let apiResponse = response.generate(true, 'Error occured at application level', 500, null)
    res.send(apiResponse)
}

let notFoundHandler = (req,res,next) => {
    console.log("notFoundHandler called")
    let apiResponse = response.generate(true, 'Route not found in the application', 404, null)
    res.status(404).send(apiResponse)
}

module.exports = {
    errorHandler : errorHandler,
    notFoundHandler : notFoundHandler
}