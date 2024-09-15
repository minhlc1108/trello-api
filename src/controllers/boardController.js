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

    // tra ve client
    res.status(StatusCodes.OK).json(board)

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

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferenceColumn,
  getListBoards
}