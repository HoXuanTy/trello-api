import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '~/controllers/boardController'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
    .get(boardController.getBoards)
    .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
    .get(boardController.getDetails)
    .put(boardValidation.update, boardController.update)
// Api support move between different columns
Router.route('/supports/moving_card')
    .put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)
export const boardRoute = Router

