import { StatusCodes } from 'http-status-codes'
import { create } from 'lodash'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { cloudinaryProvider } from '~/providers/cloudinaryProvider'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }
    //Gọi tới tầng Model để xử lý lưu bản ghi newCard vào trong DB
    const createdCard = await cardModel.createNew(newCard)

    // Lấy bản ghi card sau khi gọi
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) { throw error }
}

const update = async (cardId, userInfo, reqBody, coverFile) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const card = await cardModel.findOneById(cardId)
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!')
    }
    let result = {}

    if (coverFile) {
      const uploadResult = await cloudinaryProvider.uploadStream(coverFile.buffer, 'cardCovers')
      if (!uploadResult) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to upload cover image!')
      }
      result = await cardModel.update(cardId, { cover: uploadResult.secure_url, updatedAt: Date.now() })
    } else if (updateData.incomingMember) {
      result = await cardModel.updateMembers(cardId, updateData.incomingMember)
    } else if (updateData.incomingComment) {
      const comment = {
        ...updateData.incomingComment,
        userId: userInfo._id,
        userEmail: userInfo.email,
        createdAt: Date.now()
      }
      result = await cardModel.pushNewComment(cardId, comment)
    } else {
      result = await cardModel.update(cardId, updateData)
    }

    return result

  } catch (error) { throw error }
}

export const cardService = {
  createNew,
  update
}
