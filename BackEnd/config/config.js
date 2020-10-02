const express = require('express');

let AppConfig = {}

AppConfig.port = 3000
AppConfig.allowedCORSorigin = "*"
AppConfig.env = 'dev'
AppConfig.db = {
    uri : 'mongodb://127.0.0.1:27017/trackitDB'
}
AppConfig.apiVersion = '/api/v1'
AppConfig.mailer = {
    user : 'sowmya@gmail.com',
    pass : 'duvvuri'
}
module.exports = {
    port : AppConfig.port,
    allowedCORSorigin : AppConfig.allowedCORSorigin,
    env : AppConfig.env,
    db : AppConfig.db,
    apiVersion : AppConfig.apiVersion,
    mailer : AppConfig.mailer
}