import React, { useEffect, useMemo, useState } from 'react'
import './App.css'
import {io} from 'socket.io-client'

const App = () => {
  const socket = useMemo( () =>  io("http://localhost:3000"), [])

  const [messageVal, setmessageVal] = useState('')
  const [roomVal, setroomVal] = useState('')

  const [sentMessages, setsentMessages] = useState([])
  const [recvMessages, setRecvMessages] = useState([])

  const [roomID, setroomID] = useState('')
  const [roomName, setroomName] = useState('')
  const [showRoomName, setshowRoomName] = useState()

  useEffect(() => {
    socket.on('connect', ()=>{
      console.log(`${socket.id} connected`)
      setroomID(socket.id)
    })

    socket.on('welcome', (s)=>{
      console.log(s)
    })

    socket.on('message-rec', (m)=>{
      setRecvMessages(m)
    })

    return ()=>{
      socket.disconnect()
      console.log(`${socket.id} disconnected`)
    }
  }, [])

  console.log(recvMessages);
  

  const handleSubmit = (e) => {
    e.preventDefault()
    if (messageVal !== ''){
      setsentMessages([...sentMessages, messageVal])
    }
  }

  const handleJoinRoom = (e) => {
    e.preventDefault()
    if(roomName === '') return
    socket.emit('join-room', roomName)
    setshowRoomName(roomName)
  }

  useEffect(() => {
    socket.emit('message', {sentMessages,roomVal,roomName})
    setmessageVal('')
  }, [sentMessages])

  console.log({sentMessages,recvMessages});
  
  
  
  return (
    <div className='main'>
      <h5>{roomID}</h5>

      <form onSubmit={e => handleJoinRoom(e)}>
        <input type='text' name='roomName' placeholder='Enter room name' value={roomName} onChange={e => setroomName(e.currentTarget.value)} />
        <button type='submit'>Join</button>
        <h5>{showRoomName}</h5>
      </form>
      <form onSubmit={(e)=>handleSubmit(e)} className='form'>
        <input type='text' name='message' placeholder='Enter your message' value={messageVal} onChange={e => setmessageVal(e.currentTarget.value)} />
        <input placeholder='Enter room id' type='text' name='room' value={roomVal} onChange={e => setroomVal(e.currentTarget.value)} />
        <button type='submit'>Send</button>
      </form>

      <div className='messages'>
        <div className='sentMessage'>
          <h2>Sent Messages</h2>
          <div className='message'>
            {sentMessages.map((m, i) => <p key={i}>{m}</p>)}
          </div>
        </div>
        <div className='receivedMessage'>
          <h2>Received Messages</h2>
          <div className='message'>
            {recvMessages.map((m, i) => <p key={i}>{m}</p>)}
          </div>
      </div>
    </div>
    </div>
  )
}

export default App