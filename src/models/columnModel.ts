import Joi from 'joi'
import { ObjectId, PushOperator } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { INVALID_UPDATED_FIELDS } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

interface Column {
    boardId?: ObjectId
    title?: string
    cardOrderIds?: ObjectId[]
    updatedAt?: number
}

interface Card {
    _id: ObjectId
    boardId: ObjectId
    columnId: ObjectId
    title: string
}

const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (column: Column): Promise<Column> => {
    return await COLUMN_COLLECTION_SCHEMA.validateAsync(column, { abortEarly: false })
}

const createNew = async (column: Column) => {
    try {
        const validatedColumn = await validateBeforeCreate(column)
        return await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne({
            ...validatedColumn,
            boardId: new ObjectId(validatedColumn.boardId)
        })
    } catch (error) {
        throw error
    }
}

const update = async (columnId: ObjectId, updateData: Column) => {
    try {
        Object.keys(updateData).forEach(fieldName => {
            if (INVALID_UPDATED_FIELDS.includes(fieldName)) {
                delete updateData[fieldName as keyof Column]
            }
        })

        if (updateData.cardOrderIds) {
            updateData.cardOrderIds = updateData.cardOrderIds.map(_id => new ObjectId(_id))
        }

        return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(columnId) },
            { $set: updateData },
            { returnDocument: "after" }
        )
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

const pushCardOrderIds = async (card: Card) => {
    try {
        return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(card.columnId) },
            { $push: { cardOrderIds: new ObjectId(card._id) } as PushOperator<Document> },
            { returnDocument: "after" }
        )
    } catch (error) {
        throw error
    }
}

export const columnModel = {
    COLUMN_COLLECTION_NAME,
    COLUMN_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    pushCardOrderIds,
    update
}