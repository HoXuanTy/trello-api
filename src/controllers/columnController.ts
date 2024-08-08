import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { columnService } from '~/services/columnService'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createdColumn = await columnService.createNew(req.body)
        res.status(StatusCodes.OK).json(createdColumn)
    } catch (error) {
        next(error)
    }
}
const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedColumn = await columnService.update(new ObjectId(req.params.id), req.body)
        res.status(StatusCodes.OK).json(updatedColumn)
    } catch (error) {
        next(error)
    }
}

export const columnController = {
    createNew,
    update
}