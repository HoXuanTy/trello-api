import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '~/controllers/boardController'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
    .get((req: Request, res: Response) => {
        res.status(StatusCodes.OK).json({ message: 'APIs Get' })
    })
    .post(boardValidation.createNew, boardController.createNew)

export const boardRoute = Router
