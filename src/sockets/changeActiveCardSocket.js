const changeActiveCardSocket = (socket) => {
  socket.on('c_changeActiveCard', (card) => {
    socket.broadcast.to(card.boardId).emit('s_changeActiveCard', card)
  })
}

export default changeActiveCardSocket