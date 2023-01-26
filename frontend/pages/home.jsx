import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { router } from 'next/router'
import { useDispatch } from 'react-redux'
import { login } from '@/src/store/userSlice'
import toast from 'react-hot-toast'
import Link from "next/link"
import GameCard from "@/components/GameCard"

export default function Home() {
  const userData = useSelector((state)=>state.user)
  const activeGameData = useSelector((state)=>state.activegame)
  const {userGames, setUserGames} = useState(null)
  const dispatch = useDispatch()

  useEffect(()=>{
    if(!userData.loggedIn){
      router.push('/')
    }
  }, [userData.loggedIn])

  const getEnemy = ()=>{
    return userData.username===activeGameData.user1 ? activeGameData.user2: activeGameData.user1
  }

  const handleLogout = async()=>{
    const res = await fetch("https://tic-tac-toe-backend-mm5k.onrender.com//auth/signout", {
      credentials: 'include',
      method: 'GET',
      mode: 'cors'
    })
    const parsed = await res.json()
    if(parsed?.success){ 
      toast.success("Logged Out successfully")
      const payload = {
        loggedIn: false,
        username: null,
        email: null
      }
      dispatch(login(payload))
    }
    else{
      if(parsed?.message) toast.error(parsed.message)
      else toast.error("UNKNOWN ERROR OCCURED")
    }
  }

  return <>
  <div className='flex flex-col items-center w-full h-full justify-center'>
    <header className='text-left w-full h-full flex justify-begin flex-col p-4 gap-4'>
      <button className="text-left text-md text-blue-300" onClick={handleLogout}>
        Logout
      </button>
      <div>
        <h2 className='text-lg'>
          Signed in as {userData.username}
        </h2>
        <h2 className='text-xl font-semibold'>
          Your Games
        </h2>
      </div>
      <div className="w-full flex flex-col gap-4 font-medium flex-shrink-0 text-lg">
        {userGames ? <div></div> : <h2>No Games Found</h2>}
        {activeGameData.gameState ? <GameCard enemy={getEnemy()} data={activeGameData} url="/game/active"/> : <></>}
      </div>
    </header>
    <div className="w-full flex flex-col gap-4 px-4 pb-4 font-semibold flex-shrink-0 text-lg">
      <Link href={"/game/new"}>
        <button className='w-full py-2 bg-blue-500 rounded-lg hover:bg-blue-400'>
          Start a new game
        </button>
      </Link>
    </div>
  </div>
  </>
}