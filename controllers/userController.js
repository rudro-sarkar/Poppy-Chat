
const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const email_auth = require("../mailer");

const validator = (email, username, password) => {
    const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const username_regex = /^[a-z0-9]+$/i;
    if (!email_regex.test(email) || email == "poppychatrealm@gmail.com") {
        return 'email_error';
    } else if (!username_regex.test(username)) {
        return 'username_error';
    } else if (username.length > 10 || username.length < 4) {
        return 'username_error';
    }
    else if (password.length < 8) {
        return 'password_error';
    } else {
        return 'ready_to_go'
    }
}

const poppyid_gen = () => {
    let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    let charactersLength = characters.length;

    for (let i = 0; i < 8; i++) {
        username += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return username;
}

const email_verification_code_gen = () => {
    return Math.floor(10000000 + Math.random() * 90000000);
}

const send_verification_mail = async (verification_code, receiver_email, username) => {
    const receiver = {
        from: 'Poppy Chat Realm',
        to: receiver_email,
        subject: 'Welcome to Poppy Chat - Verify Your Email to Get Started!',
        html: `<p>Hi ${username}</p><br>
        <h2>Welcome to Poppy Chat! We're thrilled to have you on board.</h2><br>
        <h4>To complete your registration and start chatting, please use the verification code below:</h4><br>
        <h1>Verification Code: <span style="color: cyan;">${verification_code}</span></h1><br>
        <h4>Simply copy and paste this code into the verification section on Poppy Chat to confirm your email address. If you have any questions or need assistance, feel free to reach out to our support from the app.</h4><br>
        <p>Happy chatting!</p><br>
        <p>Best regards,</p><br>
        <p>Poppy Chat Realm</p>`
    }

    email_auth.sendMail(receiver, (error, emailRes) => {
        if (error) throw error;
    });
}

const loadJoinPage = async (req, res) => {
    try {
        if (req.session.user_credentials) {
            res.render('email_verify', { message: '' });
        } else {
            res.render('register', { message: '' });
        }
    } catch (error) {
        console.log(error);
    }
}

const join = async (req, res) => {
    if (req.session.user_credentials) {
        res.render('email_verify', { message: '' });
    } else {
        try {
            const { email, username, password } = req.body;
            const valid_status = validator(email, username, password);
            let msg = '';
            if (valid_status == "email_error") { msg = 'Invalid Email.' }
            else if (valid_status == "username_error") { msg = 'Invalid Username.' }
            else if (valid_status == "password_error") { msg = 'Invalid Password.' }
            else if (valid_status == "ready_to_go") { msg = 'ready_to_go' }
            if (msg != 'ready_to_go') {
                res.render('register', { message: msg });
            } else {
                let searched_document = await userModel.findOne({email: email});
                if (searched_document) {
                    res.render('register', { message: 'A user with this email already exists!' });
                }else {
                    let poppy_id = poppyid_gen();
                    req.session.user_credentials = {
                        name: username,
                        poppy_id: poppy_id,
                        email: email,
                        password: password,
                        verification_code: email_verification_code_gen()
                    }
                    send_verification_mail(req.session.user_credentials.verification_code, req.session.user_credentials.email, req.session.user_credentials.name);
                    res.render('email_verify', { message: '' });
                } 
            }
        } catch (error) {
            console.log(error);
        }
    }

}

const verify = async (req, res) => {
    if (req.session.user_credentials) {
        const verification_input = req.body.code;
        const verification_code = req.session.user_credentials.verification_code;
        if (verification_code == verification_input) {
            let plain_pass = req.session.user_credentials.password;
            let salt_count = 10;
            const hashed_pass = await bcrypt.hash(plain_pass, salt_count);
            await userModel.insertMany([
                {
                    name: req.session.user_credentials.name,
                    poppy_id: req.session.user_credentials.poppy_id,
                    email: req.session.user_credentials.email,
                    password: hashed_pass
                }
            ]);
            req.session.destroy();
            res.render('verified');
        } else {
            res.render('email_verify', { message: 'Invalid verification code!' });
        }
    } else {
        res.redirect('/join');
    }
}

const abortUserJoinRequest = async (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

module.exports = {
    loadJoinPage,
    join,
    verify,
    abortUserJoinRequest
}