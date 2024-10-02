const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: 'krrishdhiman841@gmail.com',
        pass: 'koenqqaygjokpkiz',
    }
})

module.exports = transporter