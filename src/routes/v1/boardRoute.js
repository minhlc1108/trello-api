import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValiDation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'


const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards' })
  })
  .post(boardValiDation.createNew, boardController.createNew)

Router.route('/:id')
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  .put(authMiddleware.isAuthorized, boardValiDation.update, boardController.update)

// route support move card
Router.route('/supports/move_card')
  .put(authMiddleware.isAuthorized, boardValiDation.moveCardToDifferenceColumn, boardController.moveCardToDifferenceColumn)
export const boardRoute = Router