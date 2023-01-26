import { io } from "socket.io-client"

const ws = io.connect("https://tic-tac-toe-backend-mm5k.onrender.com", {withCredentials: true})

export { ws }