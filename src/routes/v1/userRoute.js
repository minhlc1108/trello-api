import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'


const Router = express.Router()

Router.route('/')
  .post(userValidation.createNew, userController.createNew)

Router.route('/:email')
  .get(userController.getUser)

Router.route('/signIn')
  .post(userValidation.signIn, userController.signIn)

Router.route('/supports/verification')
  .put(userValidation.verificationAccount, userController.verificationAccount)
export const userRoute = Router