import express from 'express'
import { inviteController } from '~/controllers/inviteController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { inviteValidation } from '~/validations/inviteValidation'

const Router = express.Router()

Router.route('/board')
  .post(authMiddleware.isAuthorized, authMiddleware.checkPermissionBoard, inviteValidation.inviteToBoard, inviteController.inviteToBoard)

Router.route('/board')
  .get(authMiddleware.isAuthorized, inviteController.getInvites)

Router.route('/:inviteId')
  .put(authMiddleware.isAuthorized, inviteValidation.updateInvite, inviteController.updateInvite)
  .delete(authMiddleware.isAuthorized, inviteController.deleteInvite)
export const inviteRoute = Router