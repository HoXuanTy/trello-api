import { columnModel } from '~/models/columnModel'
import { ObjectId } from 'mongodb'

interface Column {
    _id: ObjectId
    boardId: ObjectId
    title: string
}

const createNew = async (column: Column) => {
    try {
        const createdColumn = await columnModel.createNew(column)
        const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)
        return getNewColumn
    } catch (error) {
        throw error
    }
}


export const columnService = {
    createNew
}