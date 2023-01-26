import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '@/src/store/userSlice'
import toast from 'react-hot-toast'
import Back from '@/components/Back'

export default function Login() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleUsername = (e)=>{
    setUsername(e.target.value)
  }
  const handlePassword = (e)=>{
    setPassword(e.target.value)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    const data = JSON.stringify({username, password})

    if(!username || !password){
      toast.error("Incomplete details")
      return
    }

    const res = await fetch("https://tic-tac-toe-backend-mm5k.onrender.com/auth/signin", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': true
      },
      credentials: 'include',
      body: data
    })

    const parsed = await res.json()
    if(parsed?.success){ 
      toast.success("Signed In Successfully")
      const payload = {
        loggedIn: true,
        username: parsed.username,
        email: parsed.email
      }
      dispatch(login(payload))
      router.push('/home')
    }
    else{
      if(parsed?.message) toast.error(parsed.message)
      else toast.error("UNKNOWN ERROR OCCURED")
    }
  }


  return <>
  <div className='flex flex-col items-center w-full h-full justify-center'>
    <header className='text-left w-full h-full flex justify-begin flex-col p-4 gap-4'>
      <Back/>
      <div>
        <h2 className='text-lg'>
          Login
        </h2>
        <h2 className='text-2xl'>
          Please Enter Your Details
        </h2>
      </div>
    </header>
    <div className='w-full flex flex-col gap-4 p-4 flex-shrink-0'>
      <form onSubmit={handleSubmit} className="text-blue-100 flex flex-col gap-3">
        <label>
          <p className='font-medium text-lg'>Username</p>
          <input type='text' className='w-full bg-gray-900 border border-sky-100 rounded-lg px-2 py-1' placeholder="Type your username here" value={username} onChange={handleUsername}/>
        </label>
        <label>
          <p className='font-medium text-lg'>Password</p>
          <input type='password' className='w-full bg-gray-900 border border-sky-100 rounded-lg px-2 py-1' placeholder="Type your password here" value={password} onChange={handlePassword}/>
        </label>
        <input type="submit" value="Login" className='font-semibold text-lg w-full py-2 bg-blue-500 rounded-lg hover:bg-blue-400'/>
      </form>
    </div>
  </div>
  </>
}
