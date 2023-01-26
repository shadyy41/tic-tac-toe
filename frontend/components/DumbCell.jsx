export default function DumbCell({val}){
  return <>
    <div className={`aspect-square flex items-center justify-center bg-gray-900`}>
      <h2 className={`text-3xl font-bold ${val==="O" ? "text-red-400" : "text-blue-600"}`}>{val}</h2>
    </div>
  </>
}