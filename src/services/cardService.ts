import { cardModel } from '~/models/cardModel'
import { ObjectId } from 'mongodb'
import { columnModel } from '~/models/columnModel'

interface Card {
    _id: ObjectId
    boardId: ObjectId
    columnId: ObjectId
    title: string
}

const createNew = async (card: Card) => {
    try {
        const createdCard = await cardModel.createNew(card)
        const getNewCard = await cardModel.findOneById(createdCard.insertedId) as Card    
        if (getNewCard) {
            await columnModel.pushCardOrderIds(getNewCard)
        }
        return getNewCard
    } catch (error) {
        throw error
    }
}


export const cardService = {
    createNew
}