import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

export const errorHandlingMiddleware = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    if(!err.statusCode) {
        err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    }

    const responseError = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode],
        stack: err.stack
    }

    console.log('BUILD_MODE Dev', env.BUILD_MODE);
    
    if (env.BUILD_MODE != 'dev') {
        delete responseError.stack
    }

    res.status(responseError.statusCode).json(responseError)
}