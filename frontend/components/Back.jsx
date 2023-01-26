import { useRouter } from 'next/router'

export default function Back(){
  const router = useRouter()
  return <>
    <button className="text-left text-3xl" onClick={()=>router.back()}>
      &#8592;
    </button>
  </>
}