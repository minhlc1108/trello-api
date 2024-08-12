import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { EMAIL_RULE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE, PASSWORD_RULE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE),
    password: Joi.string().required().pattern(PASSWORD_RULE)
  })

  try {
    // set abortEarly để không bỏ qua kiểm tra khi đã có lỗi phía trc
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    //sau khi validate xong thi request di tiep qua controller
    next()
  } catch (error) {
    const errorMessage = new Error(error).message // lay ValidationError: message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }

}

const verificationAccount = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE),
    token: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message // lay ValidationError: message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const signIn = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message('Email is invalid.'),
    password: Joi.string().required()
  })
  try {
    await correctCondition.validateAsync(req.body)
    next()
  } catch (error) {
    const errorMessage = new Error(error).message // lay ValidationError: message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    currentPassword: Joi.string().pattern(PASSWORD_RULE).message('Your current password is invalid!'),
    newPassword: Joi.string().pattern(PASSWORD_RULE).message('Your new password is invalid!'),
    displayName: Joi.string().trim().min(3).max(50)
  })

  try {
    await correctCondition.validateAsync(req.body,
      {
        allowUnknown: true,
        abortEarly: false
      }
    )
    next()
  } catch (error) {
    const errorMessage = new Error(error).message // lay ValidationError: message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const userValidation = {
  createNew,
  signIn,
  verificationAccount,
  update
}