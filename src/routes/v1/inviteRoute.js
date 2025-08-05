import express from 'express'
import { inviteController } from '~/controllers/inviteController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { inviteValidation } from '~/validations/inviteValidation'

const Router = express.Router()

Router.route('/board')
  .post(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, inviteValidation.inviteToBoard, inviteController.inviteToBoard)

Router.route('/board/:boardId')
  .get(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, inviteController.getInvites)

Router.route('/:inviteId')
  .put(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, inviteValidation.updateInvite, inviteController.updateInvite)
export const inviteRoute = Router