import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { boardModel } from '~/models/boardModel'
import { jwtProvider } from '~/providers/jwtProvider'
import ApiError from '~/utils/ApiError'
import { BOARD_ROLES, BOARD_TYPES } from '~/utils/constants'

const isAuthorized = (req, res, next) => {
  const accessToken = req.cookies?.accessToken
  if (!accessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token is invalid!'))
  }
  try {
    const decoded = jwtProvider.verifyToken(env.ACCESS_TOKEN_SECRET_SIGNATURE, accessToken)

    req.jwtDecoded = decoded

    next()
  } catch (error) {
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Token is expired!'))
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED))
  }
}

const checkPermissionBoard = async (req, res, next) => {
  try {
    const { _id: userId } = req.jwtDecoded
    const boardId = req.body.boardId || req.params.boardId
    if (!boardId) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, 'Board ID is required!'))
    }
    if (!userId) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'You must log in first!'))
    }
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Board not found!'))
    }

    const isOwner = board.ownerIds.some(id => id.toString() === userId)
    const isMember = board.memberIds.some(id => id.toString() === userId)
    if (isOwner || isMember) {
      req.role = isOwner ? BOARD_ROLES.ADMIN : isMember ? BOARD_ROLES.MEMBER : null
      return next()
    }

    if (board.type === BOARD_TYPES.PUBLIC && req.method == 'GET') {
      next()
    } else {
      next(new ApiError(StatusCodes.FORBIDDEN, 'You are not member of this board!'))
    }

  } catch (error) {
    next(error)
  }
}

export const authMiddleware = {
  isAuthorized,
  checkPermissionBoard
}