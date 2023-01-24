import express from 'express'
const router = express.Router()

import { encrypt_password } from './middleware/encrypt_password.js'
import { create_user } from './middleware/create_user.js'
import { find_user } from './middleware/find_user.js'
import { decrypt_password } from './middleware/decrypt_password.js'
import { sign_jwt } from './middleware/sign_jwt.js'
import { validate_user } from './middleware/validate_user.js'
import { is_authorized } from '../../middleware/is_authorized.js'

router.post('/signup', validate_user, encrypt_password, create_user, sign_jwt, (req, res)=>{
  const options = {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: true,
    sameSite: 'none', //Allow cookies to be sent across domains, only https or localhost
    httpOnly: true
  }
  res.cookie('TOKEN', req.body.token, options)
  // res.header('Access-Control-Allow-Credentials', true)

  const result = {
    username: req.body.username,
    email: req.body.email,
    success: true
  }
  res.send(result)
})

router.post('/signin', find_user, decrypt_password, sign_jwt, (req, res)=>{
  const options = {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: true,
    sameSite: 'none',
    httpOnly: true
  }
  res.cookie('TOKEN', req.body.token, options)

  const result = {
    username: req.body.username,
    email: req.body.email,
    success: true
  }
  res.send(result)
})

router.get('/signout', is_authorized, async(req, res, next)=>{
  res.clearCookie('TOKEN')
  res.send({success: true, message: "SIGNED OUT"})
})

router.get('/verify', is_authorized, async(req, res, next)=>{ /* Verify existing token */
  const result = {
    username: res.locals.credentials.username, 
    email: res.locals.credentials.email,
    success: true
  }
  res.send(result)
})

export { router }