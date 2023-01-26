import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { v4 as uuidv4 } from 'uuid'
import Back from "@/components/Back"
import Cell from "@/components/Cell"
import toast from "react-hot-toast"
import { ws } from "@/src/ws"

export default function Room(){
  const router = useRouter()
  const activeGameData = useSelector((state)=>state.activegame)
  const userData = useSelector((state)=>state.user)
  const [selected, setSelected] = useState([0, 0])

  const getEnemy = ()=>{
    return userData.username===activeGameData.user1 ? activeGameData.user2: activeGameData.user1
  }

  const findMove = ()=>{
    const enemy = getEnemy()
    if(enemy===activeGameData.user1){ /* enemy created the match */
      if(activeGameData.turn===1) return `Their move`
      else return `Your move`
    }
    else{
      if(activeGameData.turn===1) return `Your move`
      else return `Their move`
    }
  }

  const getCellState = (e)=>{
    if(e===0) return ""
    if(e===1){
      if(activeGameData.user1===getEnemy()) return "O"
      else return "X"
    }
    if(e===2){
      if(activeGameData.user1===getEnemy()) return "X"
      else return "O"
    }
  }

  const submitMove = ()=>{
    const enemy = getEnemy()
    if(activeGameData.turn==1){
      if(enemy===activeGameData.user1){
        toast.error("Wait for your move")
        return
      }
    }
    else{
      if(enemy!==activeGameData.user1){
        toast.error("Wait for your move")
        return
      }
    }
    const i = selected[0], j = selected[1], roomID = activeGameData.id
    if(activeGameData.gameState[i][j]!==0){
      toast.error("Cannot pick this position")
      return
    }
    ws.emit('add_move', {roomID, i, j})
  }

  useEffect(()=>{
    if(!activeGameData.gameState){
      toast.error("No active games")
      router.replace('/home')
    }
  }, [])

  return <>
    <div className='flex flex-col items-center w-full h-full justify-begin'>
      <header className='text-left w-full h-fit flex justify-begin flex-col p-4 gap-2'>
        <Back/>
        <h2 className='text-2xl font-semibold'>
          Game with {getEnemy()}
        </h2>
        <p className="text-sm">
          Your piece
        </p>
        <h2 className="text-3xl font-bold text-blue-600">X</h2>
      </header>
      <div className="h-fit w-full text-center aspect-square px-4 pb-4">
        <header className="py-4 bg-blue-600">
          <p className="text-md">
            {findMove()}
          </p>
        </header>
        <div className='w-full grid grid-cols-3 gap-1 bg-blue-600'>
          {activeGameData.gameState && activeGameData.gameState.map((row, i)=>row.map((e, j)=><Cell val={getCellState(e)} key={uuidv4()} i={i} j={j} sel={selected} setCellState={setSelected}/>))}
        </div>
      </div>
      <div className="w-full flex flex-col gap-4 px-4 pb-4 font-semibold flex-shrink-0 text-lg">
        <button className='w-full py-2 bg-blue-500 rounded-lg hover:bg-blue-400' onClick={submitMove}>
          Submit!
        </button>
      </div>
    </div>
  </>
}