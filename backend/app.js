
require('dotenv').config()
const services = {
    // url for encryption of path
    // https://emn178.github.io/online-tools/sha256.html
    signUp: "/844c62b1fbf4d74286afab7e8af47a026bdb1647cbe8730b0466b2ee6ad75a43",
    logIn: "/2708d0932454740f522d2d58dfd3ff0021fa0d6abcf4a4653d141874cedfdde1",
    auth: "/auth",
  
    getMsg: "/f11e9ffe2e91b0aaeb66ecdaa1c10c86d73b10554286f03f27e572cb31b221f5",
    sendMsg: "/31e06f7d89feb99a0e6c0affe198748c3bb5bef5e3cc92d95cb9e996197d3fc3",
    getHomeData: "/getHomeData",
    startRoom: "/startRoom",

    
    startRoomOOO: "/startRoomOOO",
    oOOmsg:"/oOOmsg",
    startRoomGrp: "/startRoomGrp",
    grpMsg: "/grpMsg",
    renameGrp: "/renameGrp",
    addUser: "/addUser",
    removeUser: "/removeUser",
    getTalks:"/getTalks"

}
const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session);
const mysql = require('mysql');
const mongoose = require('mongoose')
const app = express();
app.use(express.json());

// encrypt and decrypt package starts
const crypto = require("crypto");
const algorithm = 'aes-256-cbc';
const salt = process.env.AES_KEY;
let key = crypto.createHash('sha256').update(String(salt)).digest('base64').substr(0, 32);
const iv = crypto.randomBytes(16);

function encrypter(inputString) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(inputString, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    const base64Data = Buffer.from(iv, 'binary').toString('base64');
    return { encryptedData, base64Data }
}
function decrypter(encryptedData, base64Data) {
    const originalData = Buffer.from(base64Data, 'base64');
    const decipher = crypto.createDecipheriv(algorithm, key, originalData);
    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");
    return decryptedData
}


// encrypt and decrypt package ends


// Models import starts
const UserModel = require("./models/User");
const ChatModel = require("./models/Chat");
const RoomModel = require("./models/Room");
// Models import ends

// SOCKET.IO starts
const http = require("http");
const { Server } = require("socket.io");
var cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log(`user connected:  ${socket.id}`)
    socket.on("msg_sent", (data) => {
        socket.broadcast.emit("msg_received", "loki sent a msg")
        console.log(data);
    })
    socket.on("join_room", (data) => {
        socket.join(data);
    })
    socket.on("room_msg_send", (data) => {
        socket.to(data.room).emit("room_msg_received", data.msg)
    })
})
// SOCKET.IO finish

// MONGOURI=mongodb+srv://logeshnr17:FfY1VxMqKHVNwsL2@cluster0.y6gasxf.mongodb.net/
// MONGOOSE starts
mongoose.connect(process.env.MONGOURI)
    .then((res) => {
        // console.log(res);
        console.log("mongo db connected");
    })

const store = new MongoDBSession({
    uri: process.env.MONGOURI,
    collection: "mySessions",
})
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: parseInt(process.env.SESSION_AGE),
    }
}))
// MONGOOSE ends

// Middleware starts
// app.use((req, res, next) => {
//     console.log(req.session);
//     next()
// })
const requireAuth = (req, res, next) => {
    const { user } = req.session;
    if (!user) {
        return res.send({
            redirect: true,
            redirectTo: '/login',
            status: "error",
            msg: 'No access!'
        })
    }
    next();
}
// Middleware ends

// API req starts
app.get('/', function (req, res) {
    res.send("NOT AUTHORIZED")
})
app.get('*', function (req, res) {
    res.send("Not found");
})

// session check process
app.post(services.auth, async (req, res) => {
    const { user } = req.session;
    if (!user) {
        return res.send(
            {
                redirect: true,
                redirectTo: '/login',
            })
    } else {
        var { username, email, receiveId, profile } = user;
        return res.send(
            {
                data: { username, email, receiveId, profile },
            })
    }
})

// Signup process
app.post(services.signUp, async (req, res) => {
    req.body.email = req.body.email.toLowerCase();
    const { username, email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (user) {
        return res.send(
            {
                status: "error",
                msg: `Hey ${username}, you are already registerd!`
            })
    }
    const hashedPw = await bcrypt.hash(password, 12);
    user = new UserModel({
        username,
        email,
        password: hashedPw
    })
    await user.save();
    return res.send(
        {
            redirect: true,
            redirectTo: '/login',
            status: "success",
            msg: `Nice to meet you, ${username}...`
        })
})

// Login process
app.post(services.logIn, async (req, res) => {
    req.body.email = req.body.email.toLowerCase();
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) {
        return res.send(
            {
                redirect: true,
                redirectTo: '/signup',
                status: "error",
                msg: "Please check the credentials!"
            })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.send(
            {
                status: "error",
                msg: `It is a wrong password, ${user.username}...`
            })
    }
    var { username, _id, receiveId, profile } = user;
    req.session.user = { username, email, _id, receiveId }
    res.json(
        {
            redirect: true,
            redirectTo: '/talk',
            status: "success",
            msg: `Welcome, ${user.username}...`,
            data: { username, email, receiveId, profile }
        })
})
// Home page data
app.post('/getHomeData', requireAuth, async (req, res) => {
    const { user } = req.session;
    // if (user.receiveId == createdBy) {
    let roomData = await RoomModel.find({});
    return res.send(
        {
            data: {roomData}
        })

    // }
})

// start chat or start group process
app.post(services.startRoom, requireAuth, async (req, res) => {
    const { user } = req.session;
    const { email } = req.body;
    console.log(req.body, user)
    // if (user.receiveId == createdBy) {
    let otherPerson = await UserModel.findOne({ email });
    if (!otherPerson) {
        return res.send(
            {
                status: "error",
                msg: "Please check the input email!"
            })
    } else {
        let room = {};
        room.roomName = ""
        room.members = ['loki', 'user two']
        room.createdBy = 'loki'
        room = new RoomModel(room)
        await room.save();
        let roomData = await RoomModel.find({});
        console.log(roomData);

        return res.send(
            {
                status: "sucess",
                msg: `Room created successfully...`,
                data: {roomData}
            })

    }
    // }
})

// send messages process
app.post(services.sendMsg, requireAuth, async (req, res) => {
    const { user } = req.session.user;
    const { message, messageFrom, messageTo, messageType, room } = req.body;
    console.log(req.body, user)
    // if (user.receiveId == req.body.messageFrom) {
    const encrypted = encrypter(message);
    let chat = {
        message: encrypted.encryptedData,
        iv: encrypted.base64Data,
        messageFrom, messageTo, messageType, room
    }
    chat = new ChatModel(chat)
    await chat.save();
    console.log(chat);
    const decrypted = decrypter(encrypted.encryptedData, encrypted.base64Data);
    console.log(decrypted)
    return res.send(
        {
            status: "sucess",
            msg: `Message sent...`
        })
    // }
})

// get messages process
app.post(services.getMsg, requireAuth, async (req, res) => {
    console.log(req.body)
    // const { email, password } = req.body;
    // let user = await UserModel.findOne({ email });
    // if (!user) {
    //     return res.send(
    //         {
    //             status: "error",
    //             msg: "Please check the credentials!"
    //         })
    // }
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //     return res.send(
    //         {
    //             status: "error",
    //             msg: `It is a wrong password, ${user.username}...`
    //         })
    // }
    return res.send(
        {
            redirect: true,
            redirectTo: '/talk',
            status: "success",
            // msg: `Welcome, ${user.username}...`
        })
})
// API req ends
const port = process.env.PORT || 4000
server.listen(port, () => {
    console.log(`Server listening to port...${port}`);
});