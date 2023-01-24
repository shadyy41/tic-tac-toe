import CryptoJS from "crypto-js"
import AES from "crypto-js/aes.js"
import { express_error } from "../../../utils/express_error.js"

const decrypt_password = (req, res, next)=>{
  const {crypt_pw, password} = req.body
  const AES_SECRET = process.env.AES_SECRET
  const pw = AES.decrypt(crypt_pw, AES_SECRET).toString(CryptoJS.enc.Utf8)

  if(pw!==password) return next(new express_error("INVALID USERNAME / PASSWORD", 401))

  next()
}

export { decrypt_password }
