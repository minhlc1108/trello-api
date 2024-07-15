import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json({
      ...createdUser,
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

const verificationAccount = async (req, res, next) => {
  try {
    await userService.verificationAccount(req.body)
    res.status(StatusCodes.OK).json({ message: 'Your account is verficated! Now you can log in and use our services' })
  } catch (error) {
    next(error)
  }
}

const signIn = async (req, res, next) => {
  try {
    const result = await userService.signIn(req.body)

    res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: true, sameSize: 'none' })
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, sameSize: 'none' })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  getUser,
  verificationAccount,
  signIn
}