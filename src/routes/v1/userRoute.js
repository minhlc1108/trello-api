import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'


const Router = express.Router()

Router.route('/')
  .post(userValidation.createNew, userController.createNew)

Router.route('/refreshToken')
  .get(userController.refreshToken)

Router.route('/signIn')
  .post(userValidation.signIn, userController.signIn)

Router.route('/supports/verification')
  .put(userValidation.verificationAccount, userController.verificationAccount)

Router.route('/:email')
  .get(userController.getUser)

export const userRoute = Router