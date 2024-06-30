import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { v4 as uuidv4 } from 'uuid'
import bcryptjs from 'bcryptjs'
import { ObjectId } from 'mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i),
  password: Joi.string().required().pattern(/^(?=.*\d)(?=.*[a-z]).{8,}$/i),
  username: Joi.string().required(),
  displayName: Joi.string().optional(),
  avatar: Joi.string().default(null),
  role: Joi.string().default('client'),
  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string().default(null),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
})

const hashPassword = (password) => {
  const salt = bcryptjs.genSaltSync(10)
  return bcryptjs.hashSync(password, salt)
}
const validateBeforeCreate = async (data) => {
  const validData = await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  return {
    ...validData,
    password: hashPassword(validData.password),
    verifyToken: uuidv4()
  }
}

const findOneByEmail = async (email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: email
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) { throw new Error(error) }
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    return createdUser
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  createNew,
  findOneByEmail,
  findOneById
}

