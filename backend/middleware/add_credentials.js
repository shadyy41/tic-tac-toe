import jwt from "jsonwebtoken"

const add_credentials = async(req, res, next)=>{
  const token = req.cookies?.TOKEN
  if(!token){
    res.locals.authorized = false
    res.locals.credentials = null
    return next()
  }
  const JWT_SECRET = process.env.JWT_SECRET
  const decoded = jwt.verify(token, JWT_SECRET)

  res.locals.authorized = true
  res.locals.credentials = decoded

  next()
}

export { add_credentials }