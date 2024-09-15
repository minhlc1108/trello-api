import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { pagingSkipValue } from '~/utils/algorithms'
import { userModel } from './userModel'

// Define Collection (Name and Schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),

  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),

  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  ownerIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
}
)

// Chỉ định ra những Field mà chúng ta không muốn cho phép cập nhật trong hàm update()
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}


const creatNew = async (data, userId) => {
  try {
    const validData = await validateBeforeCreate(data)

    const createData = {
      ...validData,
      ownerIds: [new ObjectId(userId)]
    }

    const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(createData)
    return createdBoard
  } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) { throw new Error(error) }
}

const getListBoards = async (userId, currentPage, itemsPerPage) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      {
        $match: {
          $or: [{ 'ownerIds': { $all: [new ObjectId(userId)] } }, { 'memberIds': { $all: [new ObjectId(userId)] } }],
          _destroy: false
        }
      },
      { $sort: { title: 1 } },
      {
        $facet: {
          boards: [
            { $skip: pagingSkipValue(currentPage, itemsPerPage) },
            { $limit: itemsPerPage }
          ],
          totalBoards: [{ $count: 'countedBoards' }]
        }
      }
    ], { collation: { locale: 'en' } }).toArray()
    return {
      boards: result[0].boards || [],
      totalBoards: result[0].totalBoards[0]?.countedBoards || 0
    }
  } catch (error) { throw new Error(error) }
}

const getDetails = async (id) => {
  try {
    // const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(id),
          _destroy: false
        }
      },
      {
        $lookup: {
          from: columnModel.COLUMN_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'columns'
        }
      },
      {
        $lookup: {
          from: cardModel.CARD_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'cards'
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'ownerIds',
          foreignField: '_id',
          pipeline: [{ $project: { password: 0, verifyToken: 0 } }],
          as: 'owners'
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'memberIds',
          foreignField: '_id',
          pipeline: [{ $project: { password: 0, verifyToken: 0 } }],
          as: 'members'
        }
      }
    ]).toArray()

    return result[0] || null
  } catch (error) { throw new Error(error) }
}

// push columnId vào cuối mảng columnOrderIds
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $push: { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) { throw new Error(error) }
}

const update = async (boardId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    if (updateData.columnOrderIds) updateData.columnOrderIds = updateData.columnOrderIds.map(_id => (new ObjectId(_id)))

    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) { throw new Error(error) }
}

const pullColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $pull: { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  creatNew,
  findOneById,
  getListBoards,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds
}
