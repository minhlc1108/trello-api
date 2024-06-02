import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict()
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

const update = async (req, res, next) => {
  // không dùng required cho trường hợp update
  const correctCondition = Joi.object({
    // nếu làm chuyển column qua board khác thì validate boardID
    // boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([])
  })

  try {
    // set abortEarly để không bỏ qua kiểm tra khi đã có lỗi phía trc
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    //sau khi validate xong thi request di tiep qua controller
    next()
  } catch (error) {
    const errorMessage = new Error(error).message // lay ValidationError: message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const columnValiDation = {
  createNew,
  update
}