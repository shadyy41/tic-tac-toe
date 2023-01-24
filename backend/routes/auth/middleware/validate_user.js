import { express_error } from "../../../utils/express_error.js"
import sanitize_html from "sanitize-html"
import validator from "email-validator"

const validate_user = (req, res, next)=>{
  const { username, email, password } = req.body
  if(!validator.validate(email)) throw new express_error("INVALID EMAIL TYPE", 400)
  if(!username || (username.length>15) || !password) throw new express_error("MISSING USER INFORMATION", 400)

  const clean = sanitize_html(username, {
    allowedTags: [],
    allowedAttributes: {},
  })
  if(clean!==username) throw new express_error("MALICIOUS USERNAME", 400)
  next()
}

export { validate_user }