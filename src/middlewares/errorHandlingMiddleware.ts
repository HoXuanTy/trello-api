import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/apiError'

export const errorHandlingMiddleware = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    if(!err.statusCode) {
        err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    }

    const responseError = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode],
        stack: err.stack
    }

    res.status(responseError.statusCode).json(responseError)
}