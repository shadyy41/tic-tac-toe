export default function Cell({val, i, j, sel, setCellState}){
  return <>
    <button className={`aspect-square flex items-center justify-center bg-gray-900 ${sel[0]==i && sel[1]==j ? "bg-gray-800/75" : ""}`} onClick={()=>setCellState([i, j])}>
      <h2 className={`text-3xl font-bold ${val==="O" ? "text-red-400" : "text-blue-600"}`}>{val}</h2>
    </button>
  </>
}