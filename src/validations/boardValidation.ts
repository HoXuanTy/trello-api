import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const createNew = async (req: Request, res: Response, next: NextFunction) => {
    const correctCondition = Joi.object({
        title: Joi.string().required().min(3).max(50).trim().strict(),
        description: Joi.string().required().min(3).max(255).trim().strict(),
    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error as string).message))
    }
}
const update = async (req: Request, res: Response, next: NextFunction) => {
    const correctCondition = Joi.object({
        title: Joi.string().min(3).max(50).trim().strict(),
        description: Joi.string().min(3).max(255).trim().strict(),
        columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error as string).message))
    }
}

export const boardValidation = {
    createNew,
    update
}