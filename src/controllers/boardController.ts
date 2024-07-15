import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createdBoard = await boardService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdBoard)
    } catch (error) {
        next(error)
    }
}

export const boardController = {
    createNew
}