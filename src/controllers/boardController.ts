import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { boardService } from '~/services/boardService'

const getBoards = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boards = await boardService.getBoards()
        res.status(StatusCodes.OK).json(boards)
    } catch (error) {
        next(error)
    }
}

const getDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const board = await boardService.getDetails(new ObjectId(req.params.id))
        res.status(StatusCodes.OK).json(board)
    } catch (error) {
        next(error)
    }
}

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createdBoard = await boardService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdBoard)
    } catch (error) {
        next(error)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedBoard = await boardService.update(new ObjectId(req.params.id), req.body)
        res.status(StatusCodes.OK).json(updatedBoard)
    } catch (error) {
        next(error)
    }
}
const moveCardToDifferentColumn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await boardService.moveCardToDifferentColumn(req.body)
        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}

export const boardController = {
    createNew,
    getDetails,
    update,
    moveCardToDifferentColumn,
    getBoards
}