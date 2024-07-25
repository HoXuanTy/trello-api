import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict(),

    cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default([])),

    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

interface Column {
    _id: ObjectId
    boardId: ObjectId
    title: string
}

const validateBeforeCreate = async (column: Column) => {
    return await COLUMN_COLLECTION_SCHEMA.validateAsync(column)
}

const createNew = async (column: Column) => {
    try {
        const validatedColumn = await validateBeforeCreate(column)
        return await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(validatedColumn)
    } catch (error) {
        throw error
    }
}

const findOneById = async (id: ObjectId) => {
    try {
        return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({
            _id: id
        })
    } catch (error) {
        throw error
    }
}

export const columnModel = {
    COLUMN_COLLECTION_NAME,
    COLUMN_COLLECTION_SCHEMA,
    createNew,
    findOneById
}