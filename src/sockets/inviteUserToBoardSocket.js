
const inviteUserToBoardSocket = (socket) => {
  socket.on('c_receiveInvites', (invitations) => {
    socket.broadcast.emit('s_receiveInvites', invitations)
  })
}

export default inviteUserToBoardSocket