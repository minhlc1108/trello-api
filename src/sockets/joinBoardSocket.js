const joinBoardSocket = (socket) => {
  socket.on('c_joinBoard', (boardId) => {
    socket.join(boardId)
  })
}

export default joinBoardSocket