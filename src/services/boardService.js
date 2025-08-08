/* eslint-disable indent */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { BOARD_ROLES, DEFAULT_CURRENT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'
const creatNew = async (reqBody, userId) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    //Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong DB
    const createdBoard = await boardModel.creatNew(newBoard, userId)
    // console.log(createdBoard)

    // Lấy bản ghi board sau khi gọi
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // console.log(getNewBoard)
    //Thêm xử lý logic khác với các collection khác tùy đặc thù dự án
    // Gửi email, notification về cho admin khi 1 cái board mới được tạo
    return getNewBoard
  } catch (error) { throw error }
}

const getDetails = async (boardId) => {
  try {

    const board = await boardModel.getDetails(boardId)

    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    const resBoard = cloneDeep(board)

    resBoard.columns = resBoard.columns.filter(column => !column._destroy)

    resBoard.columns.forEach(column => {
      // dùng equals method ObjectId MongoDB
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id) && !card._destroy)
    })

    delete resBoard.cards
    return resBoard
  } catch (error) { throw error }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) { throw error }
}

const moveCardToDifferenceColumn = async (reqBody) => {
  try {
    //  b1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (bản chất là xóa cardId đi trong mảng)
    await columnModel.update(reqBody.prevColumnId, { cardOrderIds: reqBody.prevCardOrderIds, updatedAt: Date.now() })
    //  b2: Cập nhật mảng cardOrderIds của Column tiếp theo(bản chất là thêm cardId vào trong mảng)
    await columnModel.update(reqBody.nextColumnId, { cardOrderIds: reqBody.nextCardOrderIds, updatedAt: Date.now() })
    //  b3: Cập nhật mảng trường columnId mới của card đã kéo
    await cardModel.update(reqBody.cardId, { columnId: reqBody.nextColumnId, updatedAt: Date.now() })

    return { updateResult: 'successfully!' }
  } catch (error) { throw error }
}

const getListBoards = async (userId, reqQuery) => {
  try {
    const { page } = reqQuery
    const result = await boardModel.getListBoards(userId, page || DEFAULT_CURRENT_PAGE, DEFAULT_ITEMS_PER_PAGE)
    return result
  } catch (error) {
    throw error
  }
}

const changeRole = async (boardId, currentUserId, userId, role) => {
  try {
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    // Kiểm tra xem người dùng hiện tại có quyền thay đổi vai trò không
    if (!board.ownerIds.some(ownerId => ownerId.equals(currentUserId))) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to change roles on this board.')
    }

    if (!board.ownerIds.some(ownerId => ownerId.equals(userId)) && !board.memberIds.some(memberId => memberId.equals(userId))) {
      throw new ApiError(StatusCodes.FORBIDDEN, `User ${userId} is not a member of this board.`)
    }

    switch (role) {
      case BOARD_ROLES.ADMIN:
        if (board.ownerIds.some(ownerId => ownerId.equals(userId))) {
          throw new ApiError(StatusCodes.BAD_REQUEST, 'User is already an admin.')
        }
        break
      case BOARD_ROLES.MEMBER:
        if (board.memberIds.some(memberId => memberId.equals(userId))) {
          throw new ApiError(StatusCodes.BAD_REQUEST, 'User is already a member of this board.')
        }
        break
    }

    if (userId === currentUserId && board.ownerIds.length === 1) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Board must have at least one owner.')
    }

    const updatedBoard = await boardModel.changeRole(boardId, userId, role)

    return updatedBoard
  } catch (error) {
    throw error
  }
}

const leaveBoard = async (boardId, userId) => {
  try {
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }
    if (!board.memberIds.some(memberId => memberId.equals(userId)) && !board.ownerIds.some(ownerId => ownerId.equals(userId))) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You are not a member of this board.')
    }

    if (board.ownerIds.length === 1 && board.ownerIds[0].toString() === userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'You cannot leave the board as you are the only owner.')
    }

    const updatedBoard = await boardModel.removeMember(boardId, userId)
    return updatedBoard
  } catch (error) {
    throw error
  }
}

const removeMember = async (boardId, currentUserId, userId) => {
  try {
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    if (!board.ownerIds.some(ownerId => ownerId.equals(currentUserId))) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to remove members from this board.')
    }

    if (userId === currentUserId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'You cannot remove yourself from the board.')
    }

    if (!board.memberIds.some(memberId => memberId.equals(userId)) && !board.ownerIds.some(ownerId => ownerId.equals(userId))) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'User is not a member of this board.')
    }

    const updatedBoard = await boardModel.removeMember(boardId, userId)

    return updatedBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  creatNew,
  getDetails,
  update,
  moveCardToDifferenceColumn,
  getListBoards,
  changeRole,
  leaveBoard,
  removeMember
}
