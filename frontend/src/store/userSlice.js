import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  loggedIn: false,
  username: null,
  email: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers:{
    login(state, action){
      state.loggedIn = action.payload.loggedIn
      state.username = action.payload.username
      state.email = action.payload.email
    }
  }
})

export const { login } = userSlice.actions
export default userSlice.reducer