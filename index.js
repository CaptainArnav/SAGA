const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-layouts');
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const multer = require('multer');
const path = require('path');
const moment = require('moment');

const storage = multer.diskStorage({
    destination: "./public/uploads/postFiles/",
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, //5mb
});


app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');

app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.end('Index');
});

app.get('/chat', (req, res) => {
    res.render('chat');
});

app.get('/subforum', (req, res) => {
    res.render('subforum');
});


app.get('/create-post', (req, res) => {
    res.render('create-post');
})

app.post('/create-post', (req, res) => {
    console.log('POST: /create-post');
    postTitle = req.body.title;
    postContent = req.body['post-content'];
    categories = req.body.tags.split(',');

    console.log(`Title: ${postTitle}`);
    console.log(`postContent: ${postContent}`);
    console.log(`categories / tags: ${categories}`);

    res.send(postTitle + postContent + categories);

    // Images / other docs through editor
    // @user functionality
    // Exit from blockquote XD
    // SQL injection
    // XSS attacks

});

app.post('/upload', upload.array('file', 1), (req, res) => {
    console.log('/uploads/postFiles/' + req.files[0].filename);
    res.json({location: '/uploads/postFiles/' + req.files[0].filename});
});


// Socket.io

io.on('connect', (socket) => {
    // Send to connected user
    socket.emit('message', "Connected");
    console.log('A user connected');

    socket.on('joinRoom', (msg) => {
        /* TODO
            1. See if request is valid, whether users exist. msg.user1 is the user who sent this message, msg.user2 is the other user, referred to here as chatWithUser
            2. If room already exists, make this socket join the room and return the object:
                    {
                        header: 'ROOM JOINED',
                        chatWithUser: {
                            fullname,
                            username,
                            imgSrc
                        },
                        roomName
                    } 
            
            3. If the room does not exist, create the room, and send the above object
            4. If any errors, send a JSON having header 'ERROR', and a string property 'error'.
        */

        // For dev only:
        socket.join(msg.roomName);
        socket.emit('system', {
            header: 'ROOM_JOINED',
            chatWithUser: {
                username: msg.user2,
                fullname: 'Full name',
                imgSrc: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            roomName: msg.roomName
        });
    });

    socket.on('loadHistoryRequest', msg => {
        /* TODO
            msg.roomName is the roomName whose message history is required.
            msg.currentUser is the user who made the request.
            Make a check if the currentUser is one of the two users of roomName 
            Return the messages associated with this roomName sorted in chronological order. Maybe a for loop with emits would be enough. Or instead of using socketio, maybe a simple AJAX request would be good enough for this?
            TRY USING AJAX FIRST */
    })

    socket.on('sendMessage', msg => {
        /* 
            This is where the server acts as the middleman.
            1. Error checks
            2. Attach timestamp to message
            3. Store the message in DB
            4. Send it to the room
        */

        // For dev
        msg.timestamp = moment().format("MMM D, hh:mm A");
        io.to(msg.roomName).emit('chatMessage', msg);
    })
    


    

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.get('/user-data', (req, res) => {
    console.log('user-data req');
    // Return usern data for current user
    res.send({currentUser:{username: '@AkshatShah21'}});
})

server.listen(3000, () => console.log('Server running'));