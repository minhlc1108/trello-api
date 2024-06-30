import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
const createNew = async (req, res, next) => {
  try {

    const createdUser = await userService.createNew(req.body)
    console.log(createdUser)
    res.status(StatusCodes.CREATED).json(createdUser)

  } catch (error) { next(error) }
}

export const userController = {
  createNew
}