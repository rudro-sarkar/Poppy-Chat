
// Importing installed modules
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");
const dotenv = require("dotenv");

// Getting data from environment variables & creating config object
dotenv.config();
const config = {
    port: process.env.PORT,
    views_path: path.resolve(__dirname, 'templates'),
    static_path: path.resolve(__dirname, 'public'),
}

// Establishing database connection & importing necessary models
require('./database');

const userModel = require("./models/user");

// Creating an express app instance
const app = express();

// Configuring the app instance
app.set('view engine', 'ejs');
app.set('views', config.views_path);
app.use(express.static(config.static_path));
app.use(bodyParser.urlencoded({extended: true}));

// Importing & setting up routes
const basic_router = require("./routes/basicRouter");
const auth_router = require("./routes/authRouter");
const login_router = require("./routes/loginRouter");

app.use(basic_router);
app.use(auth_router);
app.use(login_router);

// Creating the server
const server = http.createServer(app);

// Creating & managing socket connections
const io = require("socket.io")(server);

// Creating general namespace & managing events
const gsp = io.of('/general'); // general namespace

// Updating user status on connection & disconnect
gsp.on('connection', async socket => {
    let userToken = socket.handshake.auth.userToken;
    // Setting user status online on DB
    await userModel.findByIdAndUpdate(userToken, { $set: { status: 'online' } });
    socket.on('disconnect', async () => {
        // Setting user status offline on DB
        await userModel.findByIdAndUpdate(userToken, { $set: { status: 'offline' } });
    });
});

// Starting the server
server.listen(config.port, () => {
    console.log(`Server is now listening on port ${config.port}`);
});



//dove code

// const userModel = require('./models/user');
// const msgsModel = require('./models/msg');

// userModel.insertMany([
//     {
//         name: 'rudro',
//         poppy_id: 'hjj',
//         email: 'dj@gg',
//         password: 'passgen',
//         status: 'who',
//         friends_list: ['a', 'c'],
//         request_list: []
//     }
// ]);

// msgsModel.insertMany([
//     {
//         sender_id: 'rudro',
//         receiver_id: 'aronno',
//         content: 'hello vai i miss u'
//     }
// ]);