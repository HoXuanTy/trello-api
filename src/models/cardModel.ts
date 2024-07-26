import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
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
    _id: ObjectId
    boardId: ObjectId
    columnId: ObjectId
    title: string
}

const validateBeforeCreate = async (card: Card) => {
    return CARD_COLLECTION_SCHEMA.validateAsync(card)
}
const createNew = async (card: Card) => {
    try {
        const validatedCard = await validateBeforeCreate(card)
        return await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(validatedCard)
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


export const cardModel = {
    CARD_COLLECTION_NAME,
    CARD_COLLECTION_SCHEMA,
    createNew,
    findOneById
}
