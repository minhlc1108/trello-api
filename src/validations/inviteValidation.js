import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { BOARD_INVITATION_STATUS } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const inviteToBoard = async (req, res, next) => {
  const correctCondition = Joi.object({
    inviteeIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).required(),
    boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const updateInvite = async (req, res, next) => {
  const correctCondition = Joi.object({
    inviteId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    status: Joi.string().valid(...Object.values(BOARD_INVITATION_STATUS)).required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const inviteValidation = {
  inviteToBoard,
  updateInvite
}
