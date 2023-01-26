import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { v4 as uuidv4 } from 'uuid'
import Back from "@/components/Back"
import DumbCell from "@/components/DumbCell"
import Link from "next/link"
import toast from "react-hot-toast"

export default function Room(){
  const [gameData, setGameData] = useState({})
  const router = useRouter()

  const getResponse = async(router)=>{
    if(!router.isReady) return
    const {id} = router.query

    try{
      const res = await fetch(`http://localhost:3001/gamedata/${id}`)
      const parsed = await res.json()
      if(!parsed.success) throw new Error()
      setGameData(parsed.data)
      console.log(parsed)
    }catch(e){
      console.log(e)
      toast.error("Invalid game id")
      router.replace('/')
    }
  }

  useEffect(()=>{
    getResponse(router)
  }, [router, router.isReady, router.query])

  const getWinner = ()=>{
    if(gameData.winner===0) return "It's a draw"
    if(gameData.winner===1) return `${gameData.user1} won the game`
    if(gameData.winner===2) return `${gameData.user2} won the game`
  }

  const getCellState = (e)=>{
    if(e===0) return ""
    if(e===1) return "X"
    if(e===2) return "O"
  }

  return <>
    <div className='flex flex-col items-center w-full h-full justify-begin'>
      <header className='text-left w-full h-fit flex justify-begin flex-col p-4 gap-2'>
        <Back/>
        <h2 className='text-2xl font-semibold'>
          {gameData.user1} v/s {gameData.user2}
        </h2>
        {/* <p className="text-sm">
          {getWinner()}
        </p>
        <h2 className="text-3xl font-bold text-blue-600">X</h2> */}
      </header>
      <div className="h-fit w-full text-center aspect-square px-4 pb-4">
        <header className="py-4 bg-blue-600">
          <p className="text-md">
            {getWinner()}
          </p>
        </header>
        <div className='w-full grid grid-cols-3 gap-1 bg-blue-600'>
          {gameData.gameState && gameData.gameState.map(e=><DumbCell val={getCellState(e)} key={uuidv4()}/>)}
        </div>
      </div>
      <div className="w-full flex flex-col gap-4 px-4 pb-4 font-semibold flex-shrink-0 text-lg">
        <Link href={"/game/new"}>
          <button className='w-full py-2 bg-blue-500 rounded-lg hover:bg-blue-400'>
            Start another game
          </button>
        </Link>
      </div>
    </div>
  </>
}