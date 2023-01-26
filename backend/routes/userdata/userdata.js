import express from 'express'
import { User } from '../../models/User.js'
import { express_error } from '../../utils/express_error.js'
const router = express.Router()

router.get('/:id', async(req, res, next)=>{
  const {id} = req.params
  try{
    let data = await User.findOne({"username": id}).populate('games').select('-password').select('-_id').select('-email').select('-timestamp')
    if(!res) throw new express_error()
    res.send({success: true, data})
  }catch(e){
    res.send({success: false})
  }
})

export { router }