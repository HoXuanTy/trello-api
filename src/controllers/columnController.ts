import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createdColumn = await columnService.createNew(req.body)
        res.status(StatusCodes.OK).json(createdColumn)
    } catch (error) {
        next(error)
    }
}

export const columnController = {
    createNew
}