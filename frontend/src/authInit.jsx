import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { login } from "./store/userSlice"
import { update } from "./store/activeGameSlice"
import { ws } from './ws.js'
import toast from "react-hot-toast"

export default function AuthInit() {
  const dispatch = useDispatch()
  const userData = useSelector((state)=>state.user)
  const router = useRouter()
  const activeGameData = useSelector((state)=>state.activegame)
  
  const verifyLogin = async()=>{
    const res = await fetch("https://tictactoe41.vercel.app/auth/verify", {
      credentials: 'include',
      method: 'GET',
      mode: 'cors'
    })
    if(!res || res.status!==200){
      return
    }

    const parsed = await res.json()

    if(parsed.success===true){
      const payload = {
        loggedIn: true,
        username: parsed.username,
        email: parsed.email
      }
      dispatch(login(payload))
    }
  }

  useEffect(()=>{
    verifyLogin()
    ws.on('invite', ({roomID})=>{
      ws.emit('join_room', ({roomID}))
      toast.success("Joining Room")
    })
    ws.on('game_state', ({data})=>{
      const payload = data
      dispatch(update(payload))
    })
    ws.on('failed_room_join', ({message})=>{
      toast.error(message)
    })
    ws.on('game_ended', ({data})=>{
      const payload = {
        gameState: null,
        winner: -1,
        user1: null,
        user2: null,
        turn: 0,
        timestamp: null,
        id: null
      }
      dispatch(update(payload))
      toast.success("Active game has ended")
      router.replace(`/game/${data.id}`)
    })
  }, [])

  useEffect(()=>{ /* Logged In -> Log Out (Closes Connection), Logging in as other user wont update user data otherwise */
    if(userData.loggedIn){
      ws.connect()
    }
    else{
      ws.disconnect()
    }
  }, [userData.loggedIn])

  return <></>
}