import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { emailProvider } from '~/providers/emailProvider'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { jwtProvider } from '~/providers/jwtProvider'
import { env } from '~/config/environment'
import { cloudinaryProvider } from '~/providers/cloudinaryProvider'

const createNew = async (reqBody) => {
  try {
    const user = await userModel.findOneByEmail(reqBody.email)

    if (user) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
    }

    const newUser = {
      ...reqBody,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: reqBody.email.split('@')[0],
      displayName: reqBody.email.split('@')[0],
      verifyToken: uuidv4()
    }

    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)
    await emailProvider.sendEmailVerification({ email: getNewUser.email, name: getNewUser.username, token: getNewUser.verifyToken })

    delete getNewUser.password
    delete getNewUser.verifyToken
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

const verificationAccount = async (reqBody) => {
  try {
    const user = await userModel.findOneByEmail(reqBody.email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    if (reqBody.token !== user.verifyToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token is invalid!')
    }

    const updateData = {
      verifyToken: null,
      isActive: true,
      updatedAt: Date.now()
    }

    await userModel.update(user._id, updateData)
  } catch (error) {
    throw error
  }
}

const signIn = async (reqBody) => {
  try {
    const user = await userModel.findOneByEmail(reqBody.email)

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Email not found!')
    }

    if (!bcryptjs.compareSync(reqBody.password, user.password)) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Email or password is incorrect!')
    }

    if (!user.isActive) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Your account is not active!')
    }

    const accessToken = jwtProvider.generateToken(
      { _id: user._id, email: user.email },
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_SECRET_LIFE
    )
    const refreshToken = jwtProvider.generateToken(
      { _id: user._id, email: user.email },
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_SECRET_LIFE
    )

    delete user.password
    delete user.verifyToken

    return { accessToken, refreshToken, ...user }
  } catch (error) {
    throw error
  }
}

const refreshToken = (clientRefreshToken) => {
  const refreshTokenDecoded = jwtProvider.verifyToken(env.REFRESH_TOKEN_SECRET_SIGNATURE, clientRefreshToken)
  const accessToken = jwtProvider.generateToken(
    {
      _id: refreshTokenDecoded._id, email: refreshTokenDecoded.email
    },
    env.ACCESS_TOKEN_SECRET_SIGNATURE,
    env.ACCESS_TOKEN_SECRET_LIFE)

  return { accessToken }
}

const update = async (reqBody, userId, fileUpload) => {
  try {
    const { currentPassword, newPassword, displayName } = reqBody
    if (!userId) {
      throw new ApiError(StatusCodes.UNAUTHORIZED)
    }
    const user = await userModel.findOneById(userId)

    let result = {}
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    if (fileUpload) {
      const uploadRespone = await cloudinaryProvider.uploadStream(fileUpload.buffer, 'users')
      result = await userModel.update(user._id, { avatar: uploadRespone.secure_url })
    }
    else if (currentPassword && newPassword) {
      if (!bcryptjs.compareSync(currentPassword, user.password)) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Your current password is incorrect!')
      }
      result = await userModel.update(user._id, { password: bcryptjs.hashSync(newPassword, 8) })
    } else {
      result = await userModel.update(user._id, { displayName: displayName })
    }

    delete result.verifyToken
    delete result.password
    return result
  } catch (error) {
    throw error
  }

}

export const userService = {
  createNew,
  getUser,
  verificationAccount,
  signIn,
  refreshToken,
  update
}