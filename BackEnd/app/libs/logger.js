const logger = require('pino')()
const moment = require('moment')


let errorFunction = (message, origin, level) => {
    let currentTime = moment()
    let error = {
        timeStamp : currentTime,
        err : message,
        origin : origin,
        level : level
    }
    logger.error(error)
    return error
}

let captureInfo = (message, origin, level) => {
    let currentTime = moment()
    
    let formattedInfo = {
        timeStamp : currentTime,
        message : message,
        origin : origin,
        level : level
    }
    
    logger.info(formattedInfo)
    return formattedInfo
}

module.exports = {
    error : errorFunction,
    info : captureInfo
}