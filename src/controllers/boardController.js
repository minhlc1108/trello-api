import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
const createNew = async (req, res, next) => {
  try {
    // console.log(req.body)

    // dieu huong du lieu den tang service
    const createdBoard = await boardService.creatNew(req.body)

    // tra ve client
    res.status(StatusCodes.CREATED).json(createdBoard)

  } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.getDetails(boardId)

    // tra ve client
    res.status(StatusCodes.OK).json(board)

  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.update(boardId, req.body)

    // tra ve client
    res.status(StatusCodes.OK).json(updatedBoard)

  } catch (error) { next(error) }
}

const moveCardToDifferenceColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferenceColumn( req.body)

    // tra ve client
    res.status(StatusCodes.OK).json(result)

  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferenceColumn
}