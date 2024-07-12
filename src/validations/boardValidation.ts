import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    const correctCondition = Joi.object({
        title: Joi.string().required().min(3).max(50).trim().strict(),
        description: Joi.string().required().min(3).max(255).trim().strict(),

    })

    try {
        await correctCondition.validateAsync(req.body, {abortEarly: false})
        next()
    } catch (error) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            error: new Error(error as string).message
        })
    }
}

export const boardValidation = {
    createNew
}