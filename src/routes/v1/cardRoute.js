import express from 'express'
import { cardValiDation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'


const Router = express.Router()

Router.route('/')
  .post(cardValiDation.createNew, cardController.createNew)

export const cardRoute = Router