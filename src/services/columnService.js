import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'

const creatNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    //Gọi tới tầng Model để xử lý lưu bản ghi newColumn vào trong DB
    const createdColumn = await columnModel.creatNew(newColumn)

    // Lấy bản ghi column sau khi gọi
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      // xử lý data trước khi trả dữ liệu về
      getNewColumn.cards = []

      // cập nhật mảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) { throw error }
}

export const columnService = {
  creatNew
}
