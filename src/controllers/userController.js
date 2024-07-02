import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import { emailProvider } from '~/providers/emailProvider'
const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)

    await emailProvider.sendEmailVerification({ email: createdUser.email, name: createdUser.username, token: createdUser.verifyToken })

    res.status(StatusCodes.CREATED).json({
      email: createdUser.email,
      message: 'Account created successfully! Please check email and verify your account before logging in'
    })
  } catch (error) { next(error) }
}

const getUser = async (req, res, next) => {
  try {
    const email = req.params.email
    const user = await userService.getUser(email)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  getUser
}