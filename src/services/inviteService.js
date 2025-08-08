import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { inviteModel } from '~/models/inviteModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { BOARD_INVITATION_STATUS } from '~/utils/constants'
import { pickUser } from '~/utils/transform'

const inviteToBoard = async (inviteeIds, boardId, inviterId, role) => {
  try {
    const result = []
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    const inviter = await userModel.findOneById(inviterId)
    if (!inviter) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter not found')
    }

    // Check if the inviter is a member of the board
    if (!role) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You are not a member of this board')
    }

    const validInvitees = []
    for (const inviteeId of inviteeIds) {
      const invitee = await userModel.findOneById(inviteeId)
      if (!invitee) {
        result.push({
          _id: inviteeId,
          status: StatusCodes.NOT_FOUND,
          message: 'User not found'
        })
        continue
      }

      if (board.memberIds.some(memberId => memberId.equals(inviteeId)) || board.ownerIds.some(ownerId => ownerId.equals(inviteeId))) {
        result.push({
          _id: inviteeId,
          status: StatusCodes.CONFLICT,
          message: 'User is already a member of the board'
        })
        continue
      }

      validInvitees.push(invitee)
    }

    if (validInvitees.length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, result.map(r => `${r._id} ${r.message}`).join(', '))
    }

    const newInvites = validInvitees.map(invitee => ({
      inviterId,
      inviteeId: invitee._id.toString(),
      boardId,
      status: BOARD_INVITATION_STATUS.PENDING
    }))

    const createResult = await inviteModel.inviteManyUsersToBoard(newInvites)

    await Promise.all(Object.entries(createResult.insertedIds).map(async ([index, id]) => {
      const getInvitation = await inviteModel.findOneById(id.toString())
      result.push({
        data: {
          ...getInvitation,
          inviter: pickUser(inviter),
          invitee: pickUser(validInvitees.find(user => user._id.toString() === getInvitation.inviteeId.toString())),
          board: board
        }, status: StatusCodes.CREATED, message: 'Invitation sent successfully'
      })
    }))
    return result
  } catch (error) {
    throw error
  }
}

const getInvites = async (userId) => {
  try {
    const invites = await inviteModel.getInvitesOfUser(userId)
    const result = invites.map(invite => ({
      ...invite,
      inviter: invite.inviter[0] || {},
      invitee: invite.invitee[0] || {},
      board: invite.board[0] || {}
    }))
    return result
  } catch (error) {
    throw error
  }
}

const updateInvite = async (inviteId, userId, data) => {
  try {
    const invite = await inviteModel.findOneById(inviteId)
    if (!invite) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invite not found')
    }
    if (invite.inviteeId.toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to update this invite')
    }

    const boardId = invite.boardId.toString()
    const board = await boardModel.findOneById(invite.boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    const boardMemberIds = [...board.memberIds, ...board.ownerIds].map(id => id.toString())
    if (boardMemberIds.includes(userId)) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You are already a member of this board')
    }

    const updateData = { ...data, updatedAt: Date.now() }

    const updatedInvite = await inviteModel.updateInvite(inviteId, updateData)
    if (updatedInvite.status === BOARD_INVITATION_STATUS.ACCEPTED) {
      await boardModel.pushMember(boardId, userId)
    }
    return updatedInvite
  } catch (error) {
    throw error
  }
}

const deleteInvite = async (inviteId, userId) => {
  try {
    const invite = await inviteModel.findOneById(inviteId)
    if (!invite) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invite not found')
    }
    if (invite.inviteeId.toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to delete this invite')
    }

    await inviteModel.updateInvite(inviteId, { _destroy: true })
    return { message: 'Invite deleted successfully' }
  } catch (error) {
    throw error
  }

}

export const inviteService = {
  inviteToBoard,
  getInvites,
  updateInvite,
  deleteInvite
}