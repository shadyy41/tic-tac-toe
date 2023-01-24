import jwt from 'jsonwebtoken'
import { express_error } from '../../../utils/express_error.js'

const sign_jwt = async(req, res, next)=>{
  const payload = {
    username: req.body.username,
    email: req.body.email
  }
  let token
  try {
    const JWT_SECRET = process.env.JWT_SECRET
    token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
  } catch (err) {
    return next(new express_error("SERVER ERROR", 500))
  }
  req.body.token = token
  next()
}

export { sign_jwt }