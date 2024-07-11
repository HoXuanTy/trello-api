import exitHook from 'async-exit-hook'
import express, { Express, Request, Response } from 'express'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from './routes/v1'

const START_SERVER = () => {
  const app: Express = express()

  app.use('/v1', APIs_V1)

  app.listen(env.APP_POST, env.APP_HOST, () => {
    console.log(`I'm running server at http://${env.APP_HOST}:${env.APP_POST}/`)
  })

  exitHook(() => {
    CLOSE_DB()
    console.log('Disconnected from MongoDb Cloud Atlas')
  })
}

(async () => {
  try {
    console.log('1. Connecting to MongoDB Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Atlas!')

    //Start the server back-end after a successful database connection
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()