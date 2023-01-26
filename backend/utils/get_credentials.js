import jwt from "jsonwebtoken"

const get_credentials = (token)=>{
  if(!token){
    return null
  }
  const JWT_SECRET = process.env.JWT_SECRET
  const decoded = jwt.verify(token, JWT_SECRET)

  return decoded
}

export { get_credentials}