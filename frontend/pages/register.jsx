import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import Back from '@/components/Back'
import { login } from '@/src/store/userSlice'

export default function Register() {
  const router = useRouter()
  const lenRef = useRef()
  const dispatch = useDispatch()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleUsername = (e)=>{
    setUsername(e.target.value)
  }
  const handleEmail = (e)=>{
    setEmail(e.target.value)
  }
  const handlePassword = (e)=>{
    setPassword(e.target.value)
  }

  const handleLength = (e)=>{
    const value = e.target.value
    if(lenRef.current) clearTimeout(lenRef.current)
    lenRef.current = setTimeout(()=>{
      if(value.length>=15){
        toast.dismiss()
        toast.error("Username cannot contain more than 15 characters",  {duration: 1500})
      }
    }, 250)
  }
  const handleSubmit = async(e)=>{
    e.preventDefault()
    const data = JSON.stringify({username, email, password})

    const res = await fetch("https://tic-tac-toe-backend-mm5k.onrender.com/auth/signup", {
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
      toast.success("Registered Successfully")
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
          Create Account
        </h2>
        <h2 className='text-2xl'>
          Let's get to know you better!
        </h2>
      </div>
    </header>
    <div className='w-full flex flex-col gap-4 p-4 flex-shrink-0'>
      <form action="" className="text-blue-100 flex flex-col gap-3" onSubmit={handleSubmit}>
        <label>
          <p className='font-medium text-lg'>Username</p>
          <input type='text' className='w-full bg-gray-900 border border-sky-100 rounded-lg px-2 py-1' placeholder="Type your username here" value={username} onChange={handleUsername} maxLength="15" onBeforeInput={handleLength}/>
        </label>
        <label>
          <p className='font-medium text-lg'>Email</p>
          <input type='text' className='w-full bg-gray-900 border border-sky-100 rounded-lg px-2 py-1' placeholder="Type your email here" value={email} onChange={handleEmail}/>
        </label>
        <label>
          <p className='font-medium text-lg'>Password</p>
          <input type='password' className='w-full bg-gray-900 border border-sky-100 rounded-lg px-2 py-1' placeholder="Type your password here" value={password} onChange={handlePassword}/>
        </label>
        <input type="submit" value="Register" className='font-bold w-full py-2 bg-blue-800 rounded-lg hover:bg-blue-700 text-lg'/>
      </form>
    </div>
  </div>
  </>
}
