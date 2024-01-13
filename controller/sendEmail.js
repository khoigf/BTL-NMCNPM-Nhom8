const nodemailer = require('nodemailer');
require("dotenv").config();
const sendEmail = (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'vietanhabc130@gmail.com', 
            pass: 'mryl xrwe usre anvv'
        },
        tls: {
          rejectUnauthorized: false //tắt kiểm tra chứng chỉ TLS (TLS certificate)
        }
    });

    const mailOptions = {
        from: {
          name: 'HustAirline',
          address: 'vietanhabc130@gmail.com'
        },
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = sendEmail;