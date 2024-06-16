
const nodemailer = require("nodemailer");

// Creating authentication for nodemailer
const auth = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: 'poppychatrealm@gmail.com',
        pass: 'hxae dpaq roha yoob'
    }
});

module.exports = auth;