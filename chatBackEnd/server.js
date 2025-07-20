const express =  require('express');
const app = express();
const http =  require('http');
const {Server} = require('socket.io');
const cors  = require("cors")

app.use(cors())

const server = http.createServer(app);
const allowedOrigins = ["http://localhost:5173"];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true // Only needed if you're using cookies/auth
  }
});

io.on("connection",(socket)=>{
  console.log("user connected",socket.id)
  
  socket.on("sendMessage",(data)=>{
    console.log(data.room,data.message)
    socket.to(data.room).emit("receiveMessage",data.message)
  })
  socket.on("joinRoom",(data)=>{
    console.log(data)
    socket.join(data)
  })
  socket.on("leaveRoom",data=>{
    socket.leave(data)
  })
})

server.listen(3000,()=>{
  console.log("server is running on port 3000")
})