const express = require('express');
const nodemailer = require('nodemailer');
const config = require('/home/sowmya/trackIt/trackItBackEnd/config/config')

let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : config.mailer.user,
        pass : config.mailer.pass
    }
})

let sendMail = (userDetails) => {
    let mailOptions = {
        from : config.mailer.user,
        to : userDetails.userEmail,
        subject : '',
        html : '',
    }
    return mailOptions
}

module.exports = {
    transporter : transporter,
    sendMail : sendMail
}