/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  /**
   * mặc định chúng ta không cần phải custom message ở phía BE, để cho FE tự validate
   * và custom message phía FE cho đẹp
   * BE chỉ cần validate đảm bảo dữ liệu chuẩn xác và trả về message mặc định từ thư viện
   * là được.
   * Quan trọng: việc validate dữ liệu bắt buộc phải có ở phía BE vì đây là điểm cuối để
   * lưu dữ liệu vào DB
   * và thông thường trong thực tế. điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu
   * ở cả BE VÀ fe
   */
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'minh title is required',
      'string.empty': 'Title is not allowed to be empty minh',
      'string.max': '{{#label}} length must be less than or equal to {{#limit}} characters long',
      'string.min': '{{#label}} length must be at least {{#limit}} characters long',
      'string.trim': '{{#label}} must not have leading or trailing whitespace'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict()
  })

  try {
    // set abortEarly để không bỏ qua kiểm tra khi đã có lỗi phía trc
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    //sau khi validate xong thi request di tiep qua controller
    next()
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }

}

export const boardValiDation = {
  createNew
}