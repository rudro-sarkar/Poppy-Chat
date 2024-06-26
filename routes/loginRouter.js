
const login_router = require("express").Router();
const loginSession = require("express-session");

const authMiddeware = require("../middlewares/authMiddle");

const login_controller = require("../controllers/loginController");
const settings_controller = require("../controllers/settingsController");
const searchController = require("../controllers/searchController");
const friendRequestController = require("../controllers/friend_request_controller");
const conversationController = require("../controllers/conversation_controller");
const roomController = require("../controllers/roomController");

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

login_router.get('/inbox', authMiddeware.session_route_mgmt, login_controller.loadDashboard);
login_router.get('/explore', authMiddeware.session_route_mgmt, login_controller.loadExplorePage);
login_router.get('/requests', authMiddeware.session_route_mgmt, login_controller.loadRequestsPage);
login_router.get('/settings', authMiddeware.session_route_mgmt, login_controller.loadSettingsPage);

login_router.post('/explore', authMiddeware.session_route_mgmt, searchController.searchAccount);

login_router.post('/reqestAccountDeletion', authMiddeware.session_route_mgmt, settings_controller.requstAccDeletion);
login_router.post('/proceedToDeletion', authMiddeware.session_route_mgmt, settings_controller.proceedAccDeletion);

login_router.post('/addfriend', authMiddeware.session_route_mgmt, searchController.addfriend);

login_router.post('/inspect/:poppy_id', authMiddeware.session_route_mgmt, friendRequestController.inspectProfile)
login_router.post('/confirmrequest/:poppy_id', authMiddeware.session_route_mgmt, friendRequestController.confirmRequest);
login_router.post('/declinerequest/:poppy_id', authMiddeware.session_route_mgmt, friendRequestController.declineRequest);

login_router.get('/conversation/:receiver_id', authMiddeware.session_route_mgmt, conversationController.initiateConversation);

login_router.get('/room', authMiddeware.session_route_mgmt, roomController.serveLanding);
login_router.get('/generateroom', authMiddeware.session_route_mgmt, roomController.generateRoom);
login_router.get('/room/:room_id', authMiddeware.session_route_mgmt, roomController.joinRoom);

login_router.get('/managefriends', authMiddeware.session_route_mgmt, friendRequestController.manageFriends);
login_router.post('/removefriend/:poppyId', authMiddeware.session_route_mgmt, friendRequestController.removeFriend);

module.exports = login_router;

