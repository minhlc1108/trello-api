import express from 'express'
import { cardValiDation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import { authMiddleware } from '~/middlewares/authMiddleware'


const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, cardValiDation.createNew, cardController.createNew)

export const cardRoute = Router