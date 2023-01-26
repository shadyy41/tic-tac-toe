import { createSlice } from "@reduxjs/toolkit"
// gameState = [[u1, null, null][null, u2, null][null, null, null]]
//   winner = 0, 1, 2, -1
//   user 1 is the creator
//   turn = 0, 1, 2
const initialState = {
  gameState: null,
  winner: -1,
  user1: null,
  user2: null,
  turn: 0,
  timestamp: null,
  id: null
}

const activeGameSlice = createSlice({
  name: 'activegame',
  initialState: initialState,
  reducers:{
    update(state, action){
      state.gameState = action.payload.gameState
      state.winner = action.payload.winner
      state.user1 = action.payload.user1
      state.user2 = action.payload.user2
      state.turn = action.payload.turn
      state.timestamp = action.payload.timestamp
      state.id = action.payload.id
    }
  }
})

export const { update } = activeGameSlice.actions
export default activeGameSlice.reducer