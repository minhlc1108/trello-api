import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
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

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const column = await columnModel.findOneById(columnId)
    if (!column) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }
    const updatedColumn = await columnModel.update(columnId, updateData)

    return updatedColumn
  } catch (error) { throw error }
}

const deleteItem = async (columnId) => {
  try {
    const deleteColumn = await columnModel.findOneById(columnId)

    if (!deleteColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }
    // xóa column
    await columnModel.update(columnId, { _destroy: true })
    // xóa cards
    await cardModel.updateManyByColumnId(columnId, { _destroy: true })
    // update columnOrderIds board
    await boardModel.pullColumnOrderIds(deleteColumn)

    return { deleteResult: 'Column and its cards deleted successfully!' }
  } catch (error) { throw error }
}


export const columnService = {
  createNew,
  update,
  deleteItem
}
