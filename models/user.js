
const connection = require("../database");

const userSchema = connection.Schema({
    name: {
        type: String,
        required: true
    },
    poppy_id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'offline'
    },
    friends_list: {
        type: Array,
        default: []
    },
    request_list: {
        type: Array,
        default: []
    }
}, {timestamps: true});

const userModel = connection.model('User', userSchema);

module.exports = userModel;