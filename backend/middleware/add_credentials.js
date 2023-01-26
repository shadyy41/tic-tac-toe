import { get_credentials } from "../utils/get_credentials.js"

const add_credentials = (req, res, next)=>{
  const decoded = get_credentials(req.cookies?.TOKEN)
  res.locals.authorized = (decoded) ? true : false
  res.locals.credentials = decoded

  next()
}

export { add_credentials }