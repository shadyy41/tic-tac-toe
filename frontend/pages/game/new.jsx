import { useRouter } from 'next/router'

export default function NewGame() {
  const router = useRouter()
  return <>
  <div className='flex flex-col items-center w-full h-full justify-center'>
    <header className='text-left w-full h-full flex justify-begin flex-col p-4 gap-4'>
      <button className="text-left text-3xl" onClick={()=>router.back()}>
        &#8592;
      </button>
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
      <form action="" className="text-blue-100 flex flex-col gap-3">
        <label>
          <p className='font-medium text-lg'>Opponent Email</p>
          <input type='email' className='w-full bg-gray-900 border border-sky-100 rounded-lg px-2 py-1' placeholder="Type their email here"/>
        </label>
        <input type="submit" value="Start Game" className='font-semibold text-lg w-full py-2 bg-blue-500 rounded-lg hover:bg-blue-400'/>
      </form>
    </div>
  </div>
  </>
}
