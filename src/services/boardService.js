/* eslint-disable no-useless-catch */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { slugify } from '~/utils/formatters'

const creatNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    //Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong DB

    //Thêm xử lý logic khác với các collection khác tùy đặc thù dự án
    // Gửi email, notification về cho admin khi 1 cái board mới được tạo

    return newBoard
  } catch (error) { throw error }
}

export const boardService = {
  creatNew
}
