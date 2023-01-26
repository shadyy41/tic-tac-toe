const check_state = (s)=>{
  if(s[1][1]!=0 && s[1][1]==s[2][2] && s[1][1]==s[0][0]) return s[1][1]
  if(s[1][1]!=0 && s[1][1]==s[0][2] && s[1][1]==s[2][0]) return s[1][1]
  if(s[1][1]!=0 && s[1][1]==s[0][1] && s[1][1]==s[2][1]) return s[1][1]
  if(s[1][1]!=0 && s[1][1]==s[1][0] && s[1][1]==s[1][2]) return s[1][1]
  if(s[1][0]!=0 && s[1][0]==s[0][0] && s[1][0]==s[2][0]) return s[1][0]
  if(s[0][1]!=0 && s[0][1]==s[0][0] && s[0][1]==s[0][2]) return s[0][1]
  if(s[2][1]!=0 && s[2][1]==s[2][2] && s[2][1]==s[2][0]) return s[2][1]
  if(s[1][2]!=0 && s[1][2]==s[0][2] && s[1][2]==s[2][2]) return s[1][2]

  let count = 0
  for(let i = 0; i<3; i++){
    for(let j = 0; j<3; j++){
      if(s[i][j]) count++
    }
  }

  if(count==9) return 0
  return -1
}

export { check_state }