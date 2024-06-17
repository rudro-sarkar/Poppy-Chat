
const login_router = require("express").Router();
const loginSession = require("express-session");

const authMiddeware = require("../middlewares/authMiddle");

const login_controller = require("../controllers/loginController");

login_router.use(loginSession({
    secret: process.env.SECONDARY_SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000
    }
}));

login_router.get('/login',authMiddeware.session_login_mgmt, login_controller.loadLoginPage);
login_router.post('/login', authMiddeware.session_login_mgmt, login_controller.login);
login_router.post('/logout',authMiddeware.session_route_mgmt,  login_controller.logout);

login_router.get('/poppy', authMiddeware.session_route_mgmt, login_controller.loadDashboard);

module.exports = login_router;

