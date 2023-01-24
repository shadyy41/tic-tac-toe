import { User } from '../../../models/User.js'
import { express_error } from '../../../utils/express_error.js'

const create_user = async(req, res, next)=>{
  const { email, username, password } = req.body
  const new_user = new User({email, username, password})

  try{
    await new_user.save()
  } catch(e){
    return next(new express_error('USERNAME / EMAIL ALREADY IN USE', 400))
  }
  
  next()
}

export { create_user }
