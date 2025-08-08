const leaveBoardSocket = (socket) => {
  socket.on('c_leaveBoard', (boardId) => {
    socket.leave(boardId)
  })
}

export default leaveBoardSocket