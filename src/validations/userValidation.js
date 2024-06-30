import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i),
    password: Joi.string().required().pattern(/^(?=.*\d)(?=.*[a-z]).{8,}$/i)
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

export const userValidation = {
  createNew
}