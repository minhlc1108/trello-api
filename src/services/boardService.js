/* eslint-disable no-useless-catch */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
const creatNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    //Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong DB
    const createdBoard = await boardModel.creatNew(newBoard)
    // console.log(createdBoard)

    // Lấy bản ghi board sau khi gọi
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // console.log(getNewBoard)
    //Thêm xử lý logic khác với các collection khác tùy đặc thù dự án
    // Gửi email, notification về cho admin khi 1 cái board mới được tạo

    return getNewBoard
  } catch (error) { throw error }
}

export const boardService = {
  creatNew
}
