/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { API_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'
const START_SERVER = () => {
  const app = express()

  const hostname = env.APP_HOST
  const port = env.APP_PORT

  app.use(cookieParser())
  //xử lý cors
  app.use(cors(corsOptions))
  // enable req.body json data
  app.use(express.json())

  app.use('/v1', API_V1)

  //Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.listen(port, hostname, () => {
    console.log(`Hello Trung Quan Dev, I am running at http://${hostname}:${port}`)
  })

  // thực hiện các thao tác cleanUp trước khi dừng server
  exitHook(() => {
    console.log('4. shutdowing')
    CLOSE_DB()
    console.log('5. disconnected')
  })
}

(async () => {
  try {
    console.log('connecting...')
    await CONNECT_DB()
    console.log('connected')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// console.log('connecting...')
// CONNECT_DB().then(console.log('connected'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })

