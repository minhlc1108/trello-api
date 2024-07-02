import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  try {
    const user = await userModel.findOneByEmail(reqBody.email)

    if (user) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
    }

    const newUser = {
      ...reqBody,
      username: reqBody.email.split('@')[0],
      displayName: reqBody.email.split('@')[0]
    }
    const createdUser = await userModel.createNew(newUser)

    const getNewUser = await userModel.findOneById(createdUser.insertedId)
    return getNewUser
  } catch (error) {
    throw error
  }
}

const getUser = async (email) => {
  try {
    const user = await userModel.findOneByEmail(email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    delete user.verifyToken
    delete user.password
    return user
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
  getUser
}