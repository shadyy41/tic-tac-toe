import AES from "crypto-js/aes.js"
import CryptoJS from "crypto-js"

const encrypt_password = (req, res, next)=>{
  const { password } = req.body
  const AES_SECRET = process.env.AES_SECRET

  const crypt_pw = AES.encrypt(CryptoJS.enc.Utf8.parse(password), AES_SECRET).toString()
  req.body.password = crypt_pw
  next()
}

export { encrypt_password }