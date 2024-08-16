import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { INVALID_UPDATED_FIELDS } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

    title: Joi.string().min(3).max(50).required().trim().strict(),
    description: Joi.string().optional(),

    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

interface Card {
    boardId?: ObjectId
    columnId?: ObjectId
    title?: string
    updatedAt?: number
}

const validateBeforeCreate = async (card: Card) => {
    return CARD_COLLECTION_SCHEMA.validateAsync(card)
}
const createNew = async (card: Card) => {
    try {
        const validatedCard = await validateBeforeCreate(card)
        return await GET_DB().collection(CARD_COLLECTION_NAME).insertOne({
            ...validatedCard,
            boardId: new ObjectId(card.boardId),
            columnId: new ObjectId(card.columnId)
        })
    } catch (error) {
        throw error
    }
}

const findOneById = async (id: ObjectId) => {
    try {
        return await GET_DB().collection(CARD_COLLECTION_NAME).findOne({
            _id: id
        })
    } catch (error) {
        throw error
    }
}

const update = async (cardId: ObjectId, updateData: Card) => {
    if (updateData.columnId) {
        updateData.columnId = new ObjectId(updateData.columnId)
    }
    try {
        Object.keys(updateData).forEach(fieldName => {
            if (INVALID_UPDATED_FIELDS.includes(fieldName)) {
                delete updateData[fieldName as keyof Card]
            }
        })
        return await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(cardId) },
            { $set: updateData },
            { returnDocument: "after" }
        )
    } catch (error) {
        throw error
    }
}

export const cardModel = {
    CARD_COLLECTION_NAME,
    CARD_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    update
}
