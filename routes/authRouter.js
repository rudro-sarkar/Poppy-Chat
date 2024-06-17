
const auth_router = require('express').Router();
const userController = require("../controllers/userController");
const userSession = require("express-session");

const authMiddeware = require("../middlewares/authMiddle");

auth_router.use(userSession({
    secret: process.env.USER_SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        expires: 3600000
    }
}));

auth_router.get('/join', authMiddeware.session_login_mgmt, userController.loadJoinPage);
auth_router.post('/join', authMiddeware.session_login_mgmt, userController.join);
auth_router.post('/verify', userController.verify);
auth_router.post('/abortUserJoinRequest', userController.abortUserJoinRequest);

module.exports = auth_router;