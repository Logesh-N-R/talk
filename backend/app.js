
require('dotenv').config()
const services = {
    // url for encryption of path
    // https://emn178.github.io/online-tools/sha256.html
    signUp: "/signUp",
    logIn: "/logIn",
    logOut: "/logOut",
    auth: "/auth",
    allUser: "/allUser",
    startRoomOOO: "/startRoomOOO",
    startRoomGrp: "/startRoomGrp",
    getMsg: "/getMsg",
    renameGrp: "/renameGrp",
    addUser: "/addUser",
    removeUser: "/removeUser",
    getTalks: "/getTalks",
    sendTalk: "/sendTalk"
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
const MessageModel = require("./models/Message");
const RoomModel = require("./models/Room");
// Models import ends

// SOCKET.IO starts
const http = require("http");
const { Server } = require("socket.io");
var cors = require('cors');
const User = require('./models/User');
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
app.post('/auth', async (req, res) => {
    const { user } = req.session;
    if (!user) {
        return res.send(
            {
                redirect: true,
                redirectTo: '/login',
            })
    } else {
        var { username, email, profile } = user;
        return res.send(
            {
                data: { username, email, profile },
            })
    }
})

// Signup process
app.post('/signUp', async (req, res) => {
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
app.post('/logIn', async (req, res) => {
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
    var { username, _id, profile } = user;
    req.session.user = { username, email, _id }
    res.json(
        {
            redirect: true,
            redirectTo: '/home',
            status: "success",
            msg: `Welcome, ${user.username}...`,
            data: { username, email, profile }
        })
})
// Logout process
app.post('/logOut', async (req, res) => {
    let user = await UserModel.findOne({ email });
    req.session.user = "";
    res.json(
        {
            redirect: true,
            redirectTo: '/login',
            status: "success",
            msg: `Bye Bye! Come back soon`,
            data: { username, email, profile }
        })
})
// All users
app.post('/allUser', requireAuth, async (req, res) => {
    const { search } = req.body;
    const { user } = req.session;
    console.log(search);
    const keyword = search ? {
        $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ]
    } : {};
    const users = await UserModel.find(keyword).find({ _id: { $ne: user._id } }).select('_id username profile')
    res.json(
        {
            status: "success",
            data: { users }
        })

})
// Home page data
app.post('/getTalks', requireAuth, async (req, res) => {
    try {
        console.log(req.session.user._id);
        RoomModel.find({ users: { $elemMatch: { $eq: req.session.user._id } } })
            .populate("users", "-password").populate("grpAdmin", "-password").populate("latestMsg").sort({ updatedAt: -1 })
            .then(async (result) => {
                result = await UserModel.populate(result, {
                    path: "latestMsg.messageFrom",
                    select: "username profile email"
                });
                res.json({
                    status: "success",
                    data: result
                })
            }
            )
    } catch (error) {
        throw new Error(error.message)
    }
})
// Create group 
app.post('/startRoomGrp', requireAuth, async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.json({
            status: "success",
            data: "Invalid input"
        })
    }
    var users = req.body.users;
    if (users.length < 2) {
        return res.json({
            status: "success",
            data: "Atleast 3 users required in a group!"
        })
    }
    users.push(req.session.user._id)
    try {
        const grpRoom = await RoomModel.create({
            roomName: req.body.name,
            users,
            isGrp: true,
            grpAdmin: req.session.user._id
        })
        const CreatedRoom = await RoomModel.findOne({ _id: grpRoom._id }).populate("users", "-password").populate('grpAdmin', '-password')
        res.json({
            status: "success",
            data: CreatedRoom
        })
    } catch (error) {
        throw new Error(error.message)
    }
})
// rename group 
app.post('/renameGrp', requireAuth, async (req, res) => {
    const { roomId, name } = req.body;
    if (!name) {
        return res.json({
            status: "success",
            data: "Please enter valid name"
        })
    }
    const UpdatedRoom = await RoomModel.findByIdAndUpdate(
        roomId,
        {
            roomName: name
        },
        {
            new: true
        }
    )
        .populate("users", "-password")
        .populate("grpAdmin", "-password")

    if (!UpdatedRoom) {
        throw new Error("Room Not Found!")
    } else {
        return res.json({
            status: "success",
            data: UpdatedRoom
        })
    }
})
// add user to group 
app.post('/addUser', requireAuth, async (req, res) => {
    const { roomId, userId } = req.body;
    const isUserAlreadyExist = await RoomModel.find({
        _id: roomId,
        users: { $elemMatch: { $eq: userId } }
    })
    if (isUserAlreadyExist.length <= 0) {
        const added = await RoomModel.findByIdAndUpdate(roomId, { $push: { users: userId } }, { new: true }).populate("users", "-password").populate("grpAdmin", "-password")

        if (!added) {
            throw new Error("Room Not Found!")
        } else {
            return res.json({
                status: "success",
                data: added
            })
        }
    } else {
        return res.json({
            status: "success",
            data: "user already in group"
        })
    }
})
// remove user from group 
app.post('/removeUser', requireAuth, async (req, res) => {
    const { roomId, userId } = req.body;
    const isUserAlreadyExist = await RoomModel.find({
        _id: roomId,
        users: { $elemMatch: { $eq: userId } }
    })
    if (isUserAlreadyExist.length > 0) {
        const removed = await RoomModel.findByIdAndUpdate(roomId, { $pull: { users: userId } }, { new: true }).populate("users", "-password").populate("grpAdmin", "-password")

        if (!removed) {
            throw new Error("Room Not Found!")
        } else {
            return res.json({
                status: "success",
                data: removed
            })
        }
    } else {
        return res.json({
            status: "success",
            data: "user not in group"
        })
    }
})
// set one on one room
app.post('/startRoomOOO', requireAuth, async (req, res) => {
    const { userId } = req.body;
    const { user } = req.session;
    if (mongoose.Types.ObjectId.isValid(userId)) {
        var userExist = await UserModel.findOne({ _id: userId }).select('-password');
    }

    if (userId && userExist) {
        var roomData = await RoomModel.find({
            isGrp: false,
            $and: [
                { users: { $elemMatch: { $eq: userId } } },
                { users: { $elemMatch: { $eq: user._id } } },
            ]
        }).populate("users", "-password").populate("latestMsg");

        roomData = await UserModel.populate(roomData, {
            path: 'latestMsg.messageFrom',
            select: "username email profile"
        })
        if (roomData.length > 0) {
            res.json(
                {
                    status: "success",
                    data: { roomData }
                })
        } else {
            var roomData = {
                roomName: "private",
                isGrp: false,
                users: [userId, user._id]
            }

            try {
                const createdRoom = await RoomModel.create(roomData);
                const newRoomData = await RoomModel.findOne({ _id: createdRoom._id }).populate("users", "-password")
                res.json(
                    {
                        status: "success",
                        data: { newRoomData }
                    })
            } catch (error) {
                throw new Error(error.message)
            }
        }
    } else {
        res.json(
            {
                status: "success",
                data: "User id is invalid!"
            })
    }
})
// get messages
app.post('/getMsg', requireAuth, async (req, res) => {
    const { roomId } = req.body;
    const isUserAlreadyExist = await RoomModel.find({
        _id: roomId,
        users: { $elemMatch: { $eq: req.session.user._id } }
    })
    console.log(isUserAlreadyExist)
    if (isUserAlreadyExist.length > 0) {

        try {
            const getMessage = await MessageModel.find({ room: roomId }).populate('messageFrom', 'username profile email').populate('room')
            res.json({
                status: "success",
                roomId: roomId,
                data: getMessage
            })
        } catch (error) {
            throw new Error(error.message)
        }
    } else {
        res.json({
            status: "success",
            roomId: roomId,
            data: "Group unavailable!"
        })
    }

})
// sendtalk
app.post('/sendTalk', requireAuth, async (req, res) => {
    const { roomId, content } = req.body
    if (!roomId || !content) {
        return res.json(
            {
                status: "success",
                data: "Empty input sent"
            })
    }
    var newMessage = {
        messageFrom: req.session.user._id,
        room: roomId,
        message: content
    }
    try {
        var message = await MessageModel.create(newMessage);
        message = await message.populate("messageFrom", "username profile");
        message = await message.populate("room");
        message = await UserModel.populate(message, {
            path: 'rooms.users',
            select: 'username profile email'
        });

        await RoomModel.findByIdAndUpdate(roomId, {
            latestMsg: message
        })
        res.json(
            {
                status: "success",
                data: message
            })

    } catch (error) {
        throw new Error(error.message)
    }

})
// API req ends
const port = process.env.PORT || 4000
server.listen(port, () => {
    console.log(`Server listening to port...${port}`);
});