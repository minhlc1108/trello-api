import express from 'express'
import { boardValiDation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, boardController.getListBoards)
  .post(authMiddleware.isAuthorized, boardValiDation.createNew, boardController.createNew)

Router.route('/:boardId')
  .get(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, boardController.getDetails)
  .put(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, boardValiDation.update, boardController.update)

// route support move card
Router.route('/supports/move_card')
  .put(authMiddleware.isAuthorized, boardValiDation.moveCardToDifferenceColumn, boardController.moveCardToDifferenceColumn)
export const boardRoute = Router