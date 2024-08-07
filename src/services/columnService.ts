import { columnModel } from '~/models/columnModel'
import { ObjectId } from 'mongodb'
import { boardModel } from '~/models/boardModel'

interface Column {
    _id: ObjectId
    boardId: ObjectId
    title: string
    cards: []
}

const createNew = async (column: Column) => {
    try {
        const createdColumn = await columnModel.createNew(column)
        const getNewColumn = await columnModel.findOneById(createdColumn.insertedId) as Column

        if (getNewColumn) {
            getNewColumn.cards = []
            //update array columnOrderIds in collection board
            await boardModel.pushColumnOrderIds(getNewColumn)
        }

        return getNewColumn
    } catch (error) {
        throw error
    }
}


export const columnService = {
    createNew
}