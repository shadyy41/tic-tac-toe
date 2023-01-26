import mongoose from 'mongoose'
const Schema = mongoose.Schema

const gameSchema = new Schema({
  timestamp: {
    type: String,
    required: true
  },
  user1: {
    type: String,
    required: true
  },
  user2: {
    type: String,
    required: true
  },
  winner: {
    type: Number,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  gameState: {
    type: [Number],
     required: true
  }
})

const Game =  mongoose.models.game || mongoose.model('Game', gameSchema)

export { Game }