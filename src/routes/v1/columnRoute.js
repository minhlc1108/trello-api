import express from 'express'
import { columnValiDation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'
import { authMiddleware } from '~/middlewares/authMiddleware'


const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, columnValiDation.createNew, columnController.createNew)

Router.route('/:columnId')
  .put(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, columnValiDation.update, columnController.update)
  .delete(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, columnValiDation.deleteItem, columnController.deleteItem)
export const columnRoute = Router