import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.NODE_ENV==='production' ? process.env.PORT : "3001"
const DB_URL = process.env.NODE_ENV==='production' ? process.env.DB_URL : "mongodb://0.0.0.0:27017/tictactoe"

import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()

import { express_error } from './utils/express_error.js'
import { router as authRouter } from './routes/auth/auth.js'

import { add_credentials } from "./middleware/add_credentials.js"
const options = {
  origin: 'http://localhost:3000',
  credentials: true
}
app.use(cors(options))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(add_credentials)/* validates jwt, adds data to res.locals */

app.use('/auth', authRouter) // /auth/signup

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

mongoose.set('strictQuery', false)
mongoose.connect(DB_URL)
  .then(() => {
    console.log("DB CONNECTED SUCCESSFULLY")
    app.listen(PORT, () => {
      console.log(`APP SERVING ON PORT ${PORT}`)
    })
  })
  .catch((err) => {
    console.log("ERROR OCCURED", err)
  })