import { User } from '../../../models/User.js'
import { express_error } from '../../../utils/express_error.js'

const find_user = async(req, res, next)=>{
  const {username} = req.body

  let user

  try{
    user = await User.findOne({"username": username})
  } catch(e){
    return next(new express_error("SERVER ERROR", 500))
  }

  if(!user) return next(new express_error("INVALID USERNAME / PASSWORD", 401))

  req.body.crypt_pw = user.password
  req.body.email = user.email

  next()
}

export { find_user }