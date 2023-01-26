import express from 'express'
import { Game } from '../../models/Game.js'
import { express_error } from '../../utils/express_error.js'
const router = express.Router()

router.get('/:id', async(req, res, next)=>{
  const {id} = req.params
  try{
    let data = await Game.findOne({"id": id})
    if(!res) throw new express_error()
    res.send({success: true, data})
  }catch(e){
    res.send({success: false})
  }
})

export { router }