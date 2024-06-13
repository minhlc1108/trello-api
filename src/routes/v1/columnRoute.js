import express from 'express'
import { columnValiDation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'


const Router = express.Router()

Router.route('/')
  .post(columnValiDation.createNew, columnController.createNew)

Router.route('/:id')
  .put(columnValiDation.update, columnController.update)
  .delete(columnValiDation.deleteItem, columnController.deleteItem)
export const columnRoute = Router