
const mongoose = require("mongoose");

// Getting Database uris
const config = {
    user_mongo_uri: process.env.USER_MONGO_URI,
    msgs_mongo_uri: process.env.MSG_MONGO_URI,
}

// Creating connection to the user database
mongoose.connect(config.user_mongo_uri).then(() => {
    console.log("Connected to DB");
}).catch(err => console.error(err));

// Creating connection to the messages database
mongoose.msgsDB = mongoose.createConnection(config.msgs_mongo_uri);

module.exports = mongoose;
