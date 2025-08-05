import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'
import { userRoute } from '~/routes/v1/userRoute'
import { inviteRoute } from '~/routes/v1/inviteRoute'

const Router = express.Router()

// Check api v1/status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API V1 are ready to use.' })
})

// boards APIs
Router.use('/boards', boardRoute)

// columns APIs
Router.use('/columns', columnRoute)

// cards APIs
Router.use('/cards', cardRoute)

Router.use('/users', userRoute)

Router.use('/invites', inviteRoute)

export const API_V1 = Router