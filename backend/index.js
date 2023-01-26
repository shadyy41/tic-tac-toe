import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.NODE_ENV==='production' ? process.env.PORT : "3001"
const DB_URL = process.env.NODE_ENV==='production' ? process.env.DB_URL : "mongodb://0.0.0.0:27017/tictactoe"

import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import { createServer } from  "http"
import { Server } from "socket.io"
import { User } from './models/User.js'
import cookie from 'cookie'
import { express_error } from './utils/express_error.js'
import { router as authRouter } from './routes/auth/auth.js'
import { router as gameDataRouter } from './routes/gamedata/gamedata.js'
import { add_credentials } from "./middleware/add_credentials.js"
import { get_credentials } from './utils/get_credentials.js'
import { Game } from './models/Game.js'
import { check_state } from './utils/check_state.js'

const app = express()
const server = createServer(app)
const io = new Server(server,  {
	cors: {
		origin: process.env.FRONTEND_URL,
    credentials: true
	}
})

const options = {
  origin: process.env.FRONTEND_URL,
  credentials: true
}
app.use(cors(options))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(add_credentials)/* validates jwt, adds data to res.locals */

app.use('/auth', authRouter) // /auth/signup
app.use('/gamedata', gameDataRouter)

app.get('*', (req, res, next)=>{
  throw new express_error('PAGE DOES NOT EXIST', 404)
})
app.post('*', (req, res, next)=>{
  throw new express_error('INVALID ROUTE', 404)
})

app.use((err, req, res, next)=>{/*error handler*/
  const {status=500} = err
  if(!err.message) err.message = 'SOMETHING WENT WRONG'
  const result = {
    message: err.message,
    success: false
  }
  res.status(status).send(result)
})

const rooms = {}
const users = {}

io.on('connection', socket =>{
  if(!socket.handshake.headers.cookie){
    socket.disconnect(true)
    return
  }

  let { TOKEN } = cookie.parse(socket.handshake.headers.cookie)
  const userinfo = get_credentials(TOKEN)

  if(!userinfo){
    socket.disconnect(true)
    return
  }

  users[userinfo.username] = {socket, roomID: null}

  for(let r in rooms){
    const room = rooms[r]
    if(room.user1===userinfo.username || room.user2===userinfo.username){
      users[userinfo.username] = {socket, roomID: room.id}
      socket.emit('game_state', {data: room})
    }
  }

  socket.on('create_room', async({ user2Email }) =>{
    let res = null

    if(users[userinfo.username].roomID){
      socket.emit('failed_room_creation', {message: "Cannot play more then 1 game at a time"})
      return
    }

    if(user2Email===userinfo.email){
      socket.emit('failed_room_creation', {message: "Cannot play with yourself"})
      return
    }
    try{
      res = await User.findOne({"email": user2Email})
    } catch(e){
      socket.emit('failed_room_creation', {message: "Unable to create room, server side error"})
      return
    }
  
    if(!res){
      socket.emit('failed_room_creation', {message: "Opponent email doesn't exist"})
      return
    }

    const user2Socket = users[res.username]?.socket

    if(!user2Socket){
      socket.emit('failed_room_creation', {message: "Opponent is offline"})
      return
    }
    if(users[res.username].roomID){
      socket.emit('failed_room_creation', {message: "Opponent is already in a game"})
      return
    }

    const roomID = uuidv4()

    rooms[roomID] = {user1: userinfo.username, user2: res.username, gameState: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], turn: 1, winner: -1, timestamp: new Date().toLocaleString(), id: roomID}

    user2Socket.emit('invite', {roomID})
    socket.emit('room_created', {roomID})
  })

  socket.on('join_room', ( {roomID} ) =>{
    if(!rooms[roomID]){
      socket.emit('failed_room_join', ({ message: "Room doesn't exist"}))
      return
    }
    if(rooms[roomID].user1!==userinfo.username && rooms[roomID].user2!==userinfo.username){
      socket.emit('failed_room_join', ({ message: "You are not a participant"}))
      return
    }
    if(users[userinfo.username].roomID){
      socket.emit('failed_room_join', ({ message: "Cannot play more then 1 game at a time"}))
      return
    }

    users[userinfo.username].roomID = roomID

    socket.emit('game_state', {data: rooms[roomID]})
  })

  socket.on('add_move', async( {roomID, i, j} )=>{
    const room = rooms[roomID]
    const {user1, user2, gameState} = room
    gameState[i][j] = (user1===userinfo.username) ? 1 : 2

    const winner = check_state(gameState)

    if(winner!=-1){
      try{
        room.winner = winner
        const state = []
        for(let i = 0; i<3; i++){
          for(let j = 0; j<3; j++){
            state.push(gameState[i][j])
          }
        }
        room.gameState = state
        const new_game = new Game(room)

        let res1 = await User.findOne({"username": user1})
        let res2 = await User.findOne({"username": user2})

        await new_game.save()

        res1.games.push(new_game._id)
        res2.games.push(new_game._id)
        
        await res1.save()
        await res2.save()

        socket.emit('game_ended', {data: room})
        if(user1===userinfo.username) users[user2].socket.emit('game_ended', {data: room})
        else users[user1].socket.emit('game_ended', {data: room})
        
        users[room.user1].roomID = null
        users[room.user2].roomID = null
        delete rooms[roomID]
      }catch(e){
        console.log(e)
      }
      return
    }

    room.turn = room.turn===1 ? 2 : 1
    socket.emit('game_state', {data: room})
    if(user1===userinfo.username) users[user2].socket.emit('game_state', {data: room})
    else users[user1].socket.emit('game_state', {data: room})
  })

})

mongoose.set('strictQuery', false)
mongoose.connect(DB_URL)
  .then(() => {
    console.log("DB CONNECTED SUCCESSFULLY")
    server.listen(PORT, () => {
      console.log(`APP SERVING ON PORT ${PORT}`)
    })
  })
  .catch((err) => {
    console.log("ERROR OCCURED", err)
  })