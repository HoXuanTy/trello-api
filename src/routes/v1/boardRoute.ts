import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
    .get((req, res) => {
        res.status(StatusCodes.OK).json({ message: 'APIs Get' })
    })
    .post(boardValidation.createNew)

export const boardRoute = Router
