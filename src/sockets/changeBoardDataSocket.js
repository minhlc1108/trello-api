
const changeBoardDataSocket = (socket) => {
  socket.on('c_changeBoardData', (board) => {
    socket.broadcast.to(board._id).emit('s_changeBoardData', board)
  })
}


export default changeBoardDataSocket