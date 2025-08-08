import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { BOARD_INVITATION_STATUS } from '~/utils/constants'
import { userModel } from './userModel'
import { boardModel } from './boardModel'

const INVITE_COLLECTION_NAME = 'invites'
const INVITE_COLLECTION_SCHEMA = Joi.object({
  inviteeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  inviterId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  status: Joi.string().valid(BOARD_INVITATION_STATUS.ACCEPTED, BOARD_INVITATION_STATUS.REJECTED, BOARD_INVITATION_STATUS.PENDING).default(BOARD_INVITATION_STATUS.PENDING),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'inviteeId', 'inviterId', 'boardId', 'createdAt']
const validateBeforeCreate = async (data) => {
  return await INVITE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const inviteManyUsersToBoard = async (data) => {
  try {
    const validData = await Promise.all(data.map(item => validateBeforeCreate(item)))
    const insertData = validData.map(item => ({
      ...item,
      inviterId: new ObjectId(String(item.inviterId)),
      inviteeId: new ObjectId(String(item.inviteeId)),
      boardId: new ObjectId(String(item.boardId))
    }))

    const result = await GET_DB().collection(INVITE_COLLECTION_NAME).insertMany(insertData, { ordered: false })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(INVITE_COLLECTION_NAME).findOne({
      _id: new ObjectId(String(id)),
      _destroy: false
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getInvitesOfUser = async (userId) => {
  try {
    const result = await GET_DB().collection(INVITE_COLLECTION_NAME).aggregate([
      {
        $match: {
          inviteeId: new ObjectId(String(userId)),
          _destroy: false
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'inviterId',
          foreignField: '_id',
          as: 'inviter',
          pipeline: [
            { $project: { 'password': 0, 'verifyToken': 0 } }
          ]
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'inviteeId',
          foreignField: '_id',
          as: 'invitee',
          pipeline: [
            { $project: { 'password': 0, 'verifyToken': 0 } }
          ]
        }
      },
      {
        $lookup: {
          from: boardModel.BOARD_COLLECTION_NAME,
          localField: 'boardId',
          foreignField: '_id',
          as: 'board'
        }
      }
    ]).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateInvite = async (id, updateData) => {
  try {

    Object.keys(updateData).forEach(key => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    const result = await GET_DB().collection(INVITE_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(id)), _destroy: false },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const inviteModel = {
  inviteManyUsersToBoard,
  findOneById,
  getInvitesOfUser,
  updateInvite
}