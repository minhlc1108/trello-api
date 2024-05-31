import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const creatNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }
    //Gọi tới tầng Model để xử lý lưu bản ghi newCard vào trong DB
    const createdCard = await cardModel.creatNew(newCard)

    // Lấy bản ghi card sau khi gọi
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) { throw error }
}

export const cardService = {
  creatNew
}
