import express from 'express'
import { columnValiDation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'
import { authMiddleware } from '~/middlewares/authMiddleware'


const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, columnValiDation.createNew, columnController.createNew)

Router.route('/:id')
  .put(authMiddleware.isAuthorized, columnValiDation.update, columnController.update)
  .delete(authMiddleware.isAuthorized, columnValiDation.deleteItem, columnController.deleteItem)
export const columnRoute = Router