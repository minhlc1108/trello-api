import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { uploadMiddleware } from '~/middlewares/uploadMiddleware'


const Router = express.Router()

Router.route('/')
  .post(userValidation.createNew, userController.createNew)
  .put(authMiddleware.isAuthorized, uploadMiddleware.upload.single('avatar'), userValidation.update, userController.update)

Router.route('/refreshToken')
  .get(userController.refreshToken)

Router.route('/signIn')
  .post(userValidation.signIn, userController.signIn)

Router.route('/signOut')
  .get(userController.signOut)

Router.route('/supports/verification')
  .put(userValidation.verificationAccount, userController.verificationAccount)

Router.route('/search')
  .get(authMiddleware.isAuthorized, userController.searchUser)

Router.route('/email/:email')
  .get(userController.getUser)

export const userRoute = Router