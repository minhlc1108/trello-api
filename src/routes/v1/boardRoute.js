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

Router.route('/changeRole/:boardId')
  .put(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, boardValiDation.changeRole, boardController.changeRole)

Router.route('/leaveBoard/:boardId')
  .put(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, boardController.leaveBoard)

Router.route('/removeMember/:boardId')
  .put(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, boardValiDation.removeMember, boardController.removeMember)

// route support move card
Router.route('/supports/move_card')
  .put(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, boardValiDation.moveCardToDifferenceColumn, boardController.moveCardToDifferenceColumn)
export const boardRoute = Router