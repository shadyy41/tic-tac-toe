import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import activeGameReduce from "./activeGameSlice"

const store = configureStore({
  reducer:{
    user: userReducer,
    activegame: activeGameReduce
  }
})

export default store