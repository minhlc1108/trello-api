import { StatusCodes } from 'http-status-codes'
import { inviteService } from '~/services/inviteService'

const inviteToBoard = async (req, res, next) => {
  try {
    const { inviteeIds, boardId } = req.body
    const userId = req.jwtDecoded?._id

    if (!inviteeIds || inviteeIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No users to invite' })
    }

    const result = await inviteService.inviteToBoard(inviteeIds, boardId, userId, req.role)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const getInvites = async (req, res, next) => {
  try {
    const { boardId } = req.params
    const userId = req.jwtDecoded?._id

    const invites = await inviteService.getInvites(boardId, userId)
    res.status(StatusCodes.OK).json(invites)
  } catch (error) {
    next(error)
  }
}


const updateInvite = async (req, res, next) => {
  try {
    const { inviteId } = req.params
    const data = req.body
    const userId = req.jwtDecoded?._id

    const result = await inviteService.updateInvite(inviteId, userId, data)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const inviteController = {
  inviteToBoard,
  getInvites,
  updateInvite
}