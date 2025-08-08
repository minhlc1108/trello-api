import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id
    const createdBoard = await boardService.creatNew(req.body, userId)

    res.status(StatusCodes.CREATED).json(createdBoard)

  } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
  try {
    const { boardId } = req.params
    const board = await boardService.getDetails(boardId)

    const responseData = {
      ...board,
      role: req.role ?? null
    }

    // tra ve client
    res.status(StatusCodes.OK).json(responseData)

  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const { boardId } = req.params
    const updatedBoard = await boardService.update(boardId, req.body)

    // tra ve client
    res.status(StatusCodes.OK).json(updatedBoard)

  } catch (error) { next(error) }
}

const moveCardToDifferenceColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferenceColumn(req.body)

    // tra ve client
    res.status(StatusCodes.OK).json(result)

  } catch (error) { next(error) }
}

const getListBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id
    const result = await boardService.getListBoards(userId, req.query)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const changeRole = async (req, res, next) => {
  try {
    const { boardId } = req.params
    const { userId, role } = req.body
    const currentUserId = req.jwtDecoded._id
    const updatedBoard = await boardService.changeRole(boardId, currentUserId, userId, role)

    // tra ve client
    res.status(StatusCodes.OK).json(updatedBoard)

  } catch (error) { next(error) }
}

const leaveBoard = async (req, res, next) => {
  try {
    const { boardId } = req.params
    const userId = req.jwtDecoded?._id
    const updatedBoard = await boardService.leaveBoard(boardId, userId)

    // tra ve client
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}

const removeMember = async (req, res, next) => {
  try {
    const { boardId } = req.params
    const currentUserId = req.jwtDecoded._id
    const userId = req.body.userId
    const updatedBoard = await boardService.removeMember(boardId, currentUserId, userId)

    // tra ve client
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}


export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferenceColumn,
  getListBoards,
  changeRole,
  leaveBoard,
  removeMember
}