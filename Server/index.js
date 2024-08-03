import express from 'express'
import {Server} from 'socket.io'
import { createServer } from 'http'

const app = express()

const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

io.on('connection', (socket)=>{
    console.log(`Client id is ${socket.id}`);
    socket.broadcast.emit('welcome', `${socket.id} entered the server`)

    socket.on('disconnect', ()=>{
        console.log(`Client ${socket.id} disconnected`)
    })

    socket.on('message', ({sentMessages,roomVal,roomName})=>{
        console.log(sentMessages);
        if(roomName){
            socket.to(roomName).emit('message-rec', sentMessages)
        }else{
            socket.to(roomVal).emit('message-rec', sentMessages)
        }
    })

    socket.on('join-room', (roomName)=>{
        socket.join(roomName)
        console.log(`Client ${socket.id} joined ${roomName}`)
    })
})

const port = process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.send('Hello, World!')
})

server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`)
})