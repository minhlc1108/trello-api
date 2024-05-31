import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'
const createNew = async (req, res, next) => {
  try {
    // console.log(req.body)

    // dieu huong du lieu den tang service
    const createdCard = await cardService.creatNew(req.body)

    // tra ve client
    res.status(StatusCodes.CREATED).json(createdCard)

  } catch (error) { next(error) }
}

export const cardController = {
  createNew
}