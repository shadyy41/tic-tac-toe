import Link from "next/link"
import { useSelector } from "react-redux"

export default function HistoryGameCard({enemy, data, url}){
  const userData = useSelector((state)=>state.user)

  const getWinner = ()=>{
    if(data.winner==userData.username) return "You Won!"
    else if(data.winner=="0") return "It's a draw!"

    return "You Lost :("
  }
  return <div className="w-full border border-blue-200 rounded-md p-3 flex flex-col h-fit gap-3">
    <h2 className='text-lg font-semibold'>Game with {enemy}</h2>
    <p className="text-sm">
      {getWinner()}
    </p>
    <p className="text-sm">
      {data.timestamp}
    </p>
    <Link href={url}>
      <button className='w-full py-2 bg-blue-500 rounded-lg hover:bg-blue-400 font-semibold text-md'>
        View Game
      </button>
    </Link>
  </div>
}