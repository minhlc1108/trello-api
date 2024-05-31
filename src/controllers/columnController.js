import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'
const createNew = async (req, res, next) => {
  try {
    // console.log(req.body)

    // dieu huong du lieu den tang service
    const createdColumn = await columnService.creatNew(req.body)

    // tra ve client
    res.status(StatusCodes.CREATED).json(createdColumn)

  } catch (error) { next(error) }
}

export const columnController = {
  createNew
}