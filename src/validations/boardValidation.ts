import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    const correctCondition = Joi.object({
        title: Joi.string().required().min(3).max(50).trim().strict(),
        description: Joi.string().required().min(3).max(255).trim().strict(),

    })

    try {
        console.log('req body',req.body)

        await correctCondition.validateAsync(req.body, {abortEarly: false})
        // next()
        res.status(StatusCodes.CREATED).json({ message: 'APIs validate Create' })
    } catch (error: any) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            error: new Error(error as string).message
        })
    }
}

export const boardValidation = {
    createNew
}