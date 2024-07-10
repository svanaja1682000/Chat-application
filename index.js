const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors')
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Your React app's URL
  }
});
app.use(cors())
let users = []
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('sendMessage', (data)=>{
    console.log(data)
    io.emit('sendResponse', data)
  })
  socket.on('newUser', (data) => {
    //Adds the new user to the list of users
    users.push(data);
    // console.log(users);
    //Sends the list of users to the client
    io.emit('newUserResponse', users);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    //Updates the list of users when a user disconnects from the server
    users = users.filter((user) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    io.emit('newUserResponse', users);
    socket.disconnect();
  });
});

server.listen(3001, () => {
  console.log('Socket.IO server running on port 3001');
});


// const express = require("express")
// const app = express()
// const cors = require("cors")
// const http = require('http').Server(app);
// const PORT = 3001
// const socketIO = require('socket.io')(http, {
//     cors: {
//         origin: "http://localhost:3000"
//     }
// });

// app.use(cors())
// let users = []

// socketIO.on('connection', (socket) => {
//     console.log(`⚡: ${socket.id} user just connected!`)  
//     socket.on("sendMessage", data => {
//       socketIO.emit("sendResponse", data)
//     })

//     socket.on("typing", data => (
//       socket.broadcast.emit("typingResponse", data)
//     ))

//     socket.on("newUser", data => {
//       users.push(data)
//       socketIO.emit("newUserResponse", users)
//     })
 
//     socket.on('disconnect', () => {
//       console.log('🔥: A user disconnected');
//       users = users.filter(user => user.socketID !== socket.id)
//       socketIO.emit("newUserResponse", users)
//       socket.disconnect()
//     });
// });

// app.get("/api", (req, res) => {
//   res.json({message: "Hello"})
// });

   
// http.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });
