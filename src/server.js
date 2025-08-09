import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { API_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import inviteUserToBoardSocket from './sockets/inviteUserToBoardSocket'
import leaveBoardSocket from './sockets/leaveBoardSocket'
import changeBoardDataSocket from './sockets/changeBoardDataSocket'
import joinBoardSocket from './sockets/joinBoardSocket'
import changeActiveCardSocket from './sockets/changeActiveCardSocket'

const START_SERVER = () => {
  const app = express()
  const server = createServer(app)
  const io = new Server(server, { cors: corsOptions, connectionStateRecovery: {} })

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(cookieParser())
  //xử lý cors
  app.use(cors(corsOptions))
  // enable req.body json data
  app.use(express.json())

  app.use('/v1', API_V1)

  //Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  io.on('connection', (socket) => {
    inviteUserToBoardSocket(socket)
    joinBoardSocket(socket)
    changeBoardDataSocket(socket)
    leaveBoardSocket(socket)
    changeActiveCardSocket(socket)
  })

  if (env.BUILD_MODE === 'production') {
    server.listen(process.env.PORT, () => {
      console.log(`Production: Hi ${env.AUTHOR} I am running at production mode on port ${process.env.PORT}`)
    })
  } else {
    server.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`Hello ${env.AUTHOR}, I am running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}`)
    })
  }

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

