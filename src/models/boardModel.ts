import Joi from 'joi'
import { ObjectId, PushOperator } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'

export interface Board {
    title: string,
    description: string,
    slug: string,
    columnOrderIds: []
}

interface Column {
    _id: ObjectId
    boardId: ObjectId
    title: string
}

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    slug: Joi.string().required().min(3).trim().strict(),
    description: Joi.string().required().min(3).max(255).trim().strict(),
    columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

// Array fields are not allowed to be updated
const INVALID_UPDATED_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (board: Board) => {
    return await BOARD_COLLECTION_SCHEMA.validateAsync(board, { abortEarly: false })
}

const createNew = async (board: Board) => {
    try {
        const validatedBoard = await validateBeforeCreate(board)
        return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validatedBoard)
    } catch (error) {
        throw error
    }
}

const findOneById = async (id: ObjectId) => {
    try {
        return await GET_DB().collection<Board>(BOARD_COLLECTION_NAME).findOne({
            _id: id
        })
    } catch (error) {
        throw error
    }
}

const getDetails = async (id: ObjectId) => {
    try {
        const board = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
            {
                $match: { _id: id, _destroy: false }
            },
            {
                $lookup: {
                    from: columnModel.COLUMN_COLLECTION_NAME,
                    localField: '_id',
                    foreignField: 'boardId',
                    as: 'columns'
                }
            },
            {
                $lookup: {
                    from: cardModel.CARD_COLLECTION_NAME,
                    localField: '_id',
                    foreignField: 'boardId',
                    as: 'cards'
                }
            }
        ]).toArray()

        return board[0] || null
    } catch (error) {
        throw error
    }
}

const update = async (id: ObjectId, updateData: Board) => {
    try {
        //Filter fields that are not allowed to be updated
        Object.keys(updateData).forEach((fieldName) => {
            if(INVALID_UPDATED_FIELDS.includes(fieldName)) {
                delete updateData[fieldName as keyof Board]
            }
        })
        const updatedBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { returnDocument: "after" }
        )
        return updatedBoard
    } catch (error) {
        throw error
    }
}

const pushColumnOrderIds = async (column: Column) => {
    try {
        return await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(column.boardId) },
            { $push: { columnOrderIds: new ObjectId(column._id) } as PushOperator<Document> },
            { returnDocument: "after" }
        )
    } catch (error) {
        throw error
    }
}

export const boardModel = {
    BOARD_COLLECTION_NAME,
    BOARD_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    pushColumnOrderIds,
    update
}
