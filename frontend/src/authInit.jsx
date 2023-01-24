import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { login } from "./store/userSlice"
export default function AuthInit() {
  const dispatch = useDispatch()

  const verifyLogin = async()=>{
    const res = await fetch("http://localhost:3001/auth/verify", {
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

  useEffect(()=>{/* On First Render, Get user credentials */
    verifyLogin()
  }, []) 
  return <></>
}