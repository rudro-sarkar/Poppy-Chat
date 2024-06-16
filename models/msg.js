
const connection = require('../database');

const msgSchema = connection.Schema({
    sender_id: {
        type: String,
        required: true
    },
    receiver_id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {timestamps: true});

const msgsModel = connection.msgsDB.model('Msgs', msgSchema);

module.exports = msgsModel;