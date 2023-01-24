import { express_error } from "../utils/express_error.js"

const is_authorized = (req, res, next)=>{
  if(!res.locals.authorized){
    return next(new express_error("LOGIN REQUIRED", 401))
  }
  next()
}

export { is_authorized }