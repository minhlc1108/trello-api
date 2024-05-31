import express from 'express'
import { columnValiDation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'


const Router = express.Router()

Router.route('/')
  .post(columnValiDation.createNew, columnController.createNew)

export const columnRoute = Router