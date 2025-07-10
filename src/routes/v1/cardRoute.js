import express from 'express'
import { cardValiDation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { uploadMiddleware } from '~/middlewares/uploadMiddleware'


const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, cardValiDation.createNew, cardController.createNew)

Router.route('/:cardId')
  .put(authMiddleware.isAuthorized, uploadMiddleware.upload.single('cover'), authMiddleware.checkPermissionBoard, cardValiDation.update, cardController.update)

export const cardRoute = Router