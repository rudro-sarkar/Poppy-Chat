
const nodemailer = require("nodemailer");

const email_app_pass = process.env.EMAIL_APP_PASSWORD;

// Creating authentication for nodemailer
const auth = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: 'poppychatrealm@gmail.com',
        pass: email_app_pass
    }
});

module.exports = auth;