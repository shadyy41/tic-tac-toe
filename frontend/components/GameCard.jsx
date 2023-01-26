import Link from "next/link"
export default function GameCard({enemy, data, url}){
  const findMove = ()=>{
    if(enemy===data.user1){ /* enemy created the match */
      if(data.turn===1) return `Waiting for ${enemy}'s turn`
      else return `It is your turn to play now`
    }
    else{
      if(data.turn===1) return `It is your turn to play now`
      else return `Waiting for ${enemy}'s turn`
    }
  }
  return <div className="w-full border border-blue-200 rounded-md p-3 flex flex-col h-fit gap-3">
    <h2 className='text-lg font-semibold'>Game with {enemy}</h2>
    <p className="text-sm">
      {findMove()}
    </p>
    <p className="text-sm">
      {data.timestamp}
    </p>
    <Link href={url}>
      <button className='w-full py-2 bg-blue-500 rounded-lg hover:bg-blue-400 font-semibold text-md'>
        Play!
      </button>
    </Link>
  </div>
}