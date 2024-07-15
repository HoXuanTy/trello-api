import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

const createNew = (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('req body', req.body)
        res.status(StatusCodes.CREATED).json({ message: 'POST from controller' })
    } catch (error) {
        next(error)
    }
}

export const boardController = {
    createNew
}