import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'
import { columnRoute } from './columnRoutes'
import { cardRoute } from './cardRoutes'

const Router = express.Router()

Router.get('/status', (req: Request, res: Response) => {
    res.status(StatusCodes.CREATED).json({ message: 'APIs ready to use' })
})

//board APIs
Router.use('/boards', boardRoute)
Router.use('/columns', columnRoute)
Router.use('/cards', cardRoute)

export const APIs_V1 = Router
