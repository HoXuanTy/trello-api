import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'

const Router = express.Router()

Router.get('/status', (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ message: 'APIs ready to use' })
})

//board APIs
Router.use('/boards', boardRoute)

export const APIs_V1 = Router
