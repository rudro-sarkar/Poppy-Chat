
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

// Importing models
const userModel = require("./models/user");
const msgModel = require("./models/msg");

// Establishing database connection & importing necessary models
require('./database');

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
const msp = io.of('/messaging'); // messaging namespace

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

msp.on('connection', async socket => {
    let sender_id;
    socket.on('initiate_conversation', receiver_id => {
        sender_id = socket.handshake.auth.senderId;
        let receiver = receiver_id;
    });

    socket.on('new_msg', async data => {
        let msg_info = {
            sender: sender_id,
            receiver: data.receiver,
            body: data.body
        }
        msgModel.insertMany([{
            sender_id: msg_info.sender,
            receiver_id: msg_info.receiver,
            content: msg_info.body
        }]).then(() => {
            socket.broadcast.emit('msg_arrive', msg_info);
        }).catch(err => console.error(err));
    });

    socket.on('load_messages', async data => {
        const sender_contents = await msgModel.find({$or: [
            { sender_id: data.sender, receiver_id: data.receiver },
            { sender_id: data.receiver, receiver_id: data.sender }
        ]});
        let msg_array = [];
        sender_contents.forEach(element => {
            let chat = { sender: element.sender_id, content: element.content }
            msg_array.push(chat);
        });
        socket.emit('msg_loaded', msg_array);
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

//dove : latest doc of database
// let document = await userModel.findOne({ poppy_id: req.session.user.poppy_id }, { sort: {created_at: -1} });
// console.log(document);