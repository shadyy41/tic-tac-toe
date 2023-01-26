import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ws } from '@/src/ws'
import toast from 'react-hot-toast'
import Back from '@/components/Back'

export default function NewGame() {
  const router = useRouter()
  const [email, setEmail] = useState("")

  useEffect(()=>{
    ws.on('failed_room_creation', ({message})=>{
      toast.error(message)
    })
    ws.on('room_created', ({roomID})=>{
      toast.success("Joining Room")
      ws.emit('join_room', ({roomID}))
      router.push(`/game/active/`)
    })
  }, [])

  const handleEmail = (e)=>{
    setEmail(e.target.value)
  }

  const handleSubmit = (e)=>{
    e.preventDefault()

    if(!email){
      toast.error("OPPONENT EMAIL CANNOT BE EMPTY")
      return
    }

    ws.emit('create_room', ({user2Email: email}))
  }
  return <>
  <div className='flex flex-col items-center w-full h-full justify-center'>
    <header className='text-left w-full h-full flex justify-begin flex-col p-4 gap-4'>
      <Back/>
      <div>
        <h2 className='text-lg'>
          Start a new game
        </h2>
        <h2 className='text-2xl'>
          Who do you want to play with?
        </h2>
      </div>
      <p className='text-lg'>
        The user will be sent an invite if they are online.
      </p>
    </header>
    <div className='w-full flex flex-col gap-4 p-4 flex-shrink-0'>
      <form className="text-blue-100 flex flex-col gap-3" onSubmit={handleSubmit}>
        <label>
          <p className='font-medium text-lg'>Opponent Email</p>
          <input type='text' className='w-full bg-gray-900 border border-sky-100 rounded-lg px-2 py-1' placeholder="Type their email here" value={email} onChange={handleEmail}/>
        </label>
        <input type="submit" value="Start Game" className='font-semibold text-lg w-full py-2 bg-blue-500 rounded-lg hover:bg-blue-400'/>
      </form>
    </div>
  </div>
  </>
}
