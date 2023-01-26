import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now()
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  games: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      default: []
    }
  ]
})

const User =  mongoose.models.user || mongoose.model('User', userSchema)

export { User }