import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'


const createNew = (req: Request, res: Response) => {

    try {
        console.log('req body',req.body)

        res.status(StatusCodes.CREATED).json({ message: 'POST from controller' })
    } catch (error) {
        if (error instanceof Error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: error.message
            })
        }
    }
}

export const boardController = {
    createNew
}