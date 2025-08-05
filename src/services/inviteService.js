import { StatusCodes } from 'http-status-codes'
import { update } from 'lodash'
import { boardModel } from '~/models/boardModel'
import { inviteModel } from '~/models/inviteModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { BOARD_INVITATION_STATUS } from '~/utils/constants'

const inviteToBoard = async (inviteeIds, boardId, inviterId, role) => {
  try {
    const result = []
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // Check if the inviter is a member of the board
    if (!role) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You are not a member of this board')
    }

    const validInviteeIds = []
    for ( const inviteeId of inviteeIds) {
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

      validInviteeIds.push(inviteeId)
    }

    if (validInviteeIds.length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, result.map(r => `${r._id} ${r.message}`).join(', '))
    }

    const newInvites = validInviteeIds.map(inviteeId => ({
      inviterId,
      inviteeId,
      boardId,
      status: BOARD_INVITATION_STATUS.PENDING
    }))

    const createResult = await inviteModel.inviteManyUsersToBoard(newInvites)

    await Promise.all(Object.entries(createResult.insertedIds).map(async ([index, id]) => {
      const getInvitation = await inviteModel.findOneById(id.toString())
      result.push({ _id: getInvitation.inviteeId.toString(), status: StatusCodes.CREATED, message: 'Invitation sent successfully' })
    }))
    return result
  } catch (error) {
    throw error
  }
}

const getInvites = async (boardId, userId) => {
  try {
    const invites = await inviteModel.getInvitesOfUserAtBoard(boardId, userId)
    if (!invites || invites.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'No invitations found for this board')
    }
    return invites
  } catch (error) {
    throw error
  }
}

const updateInvite = async (inviteId, userId, data) => {
  try {
    const updateData = {
      ...data
    }
    const updatedInvite = await inviteModel.updateInvite(inviteId, updateData)
    return updatedInvite
  } catch (error) {
    throw error
  }
}

export const inviteService = {
  inviteToBoard,
  getInvites,
  updateInvite
}