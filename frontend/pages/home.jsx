import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import router from "next/router"
import { useDispatch } from 'react-redux'
import { login } from '@/src/store/userSlice'
import { v4 as uuidv4 } from "uuid"
import toast from 'react-hot-toast'
import Link from "next/link"
import GameCard from "@/components/GameCard"
import HistoryGameCard from "@/components/HistoryGameCard"

export default function Home() {
  const userData = useSelector((state)=>state.user)
  const activeGameData = useSelector((state)=>state.activegame)
  const [userGames, setUserGames] = useState(null)
  const dispatch = useDispatch()

  const getResponse = async()=>{
    try{
      const res = await fetch(`https://tic-tac-toe-backend-mm5k.onrender.com/userdata/${userData.username}`)
      const parsed = await res.json()
      if(!parsed.success) throw new Error()
      setUserGames(parsed.data?.games)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(()=>{
    getResponse()
  }, [])

  useEffect(()=>{
    if(!userData.loggedIn){
      router.replace('/')
    }
  }, [userData.loggedIn])

  const getEnemy = ()=>{
    return userData.username===activeGameData.user1 ? activeGameData.user2: activeGameData.user1
  }

  const handleLogout = async()=>{
    const res = await fetch("https://tic-tac-toe-backend-mm5k.onrender.com/auth/signout", {
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
    <header className='text-left w-full flex justify-begin flex-col p-4 gap-4'>
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
    </header>
    <div className="w-full flex flex-col gap-4 font-medium flex-shrink-0 text-lg px-4 overflow-auto flex-1">
      {activeGameData.gameState && <GameCard enemy={getEnemy()} data={activeGameData} url="/game/active"/>}
      {userGames && userGames.map(g=><HistoryGameCard url={`/game/${g.id}`} enemy={userData.username==g.user1 ? g.user2 : g.user1} data={g} key={uuidv4()}/>)}
      {(!userGames || !userGames.length) && !activeGameData.gameState && <h2 className='text-xl'>
          No Games Found
        </h2>}
    </div>
    <div className="w-full flex flex-col gap-4 p-4 font-semibold text-lg">
      <Link href={"/game/new"}>
        <button className='w-full py-2 bg-blue-500 rounded-lg hover:bg-blue-400'>
          Start a new game
        </button>
      </Link>
    </div>
  </div>
  </>
}