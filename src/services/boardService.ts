import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import { ObjectId } from 'mongodb'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
const createNew = async (reqBody: { title: string, description: string, slug: string }) => {
    try {
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title)
        }
        const createdBoard = await boardModel.createNew(newBoard)
        const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
        return getNewBoard
    } catch (error) {
        throw error
    }
}
const getDetails = async (boardId: ObjectId) => {
    try {
        const board = await boardModel.getDetails(boardId)
        if (!board) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
        }

        const resBoard = cloneDeep(board)
        resBoard.columns.forEach((column: any) => {
            column.cards = resBoard.cards.filter((card: any) => card.columnId.equals(column._id))
        });

        delete resBoard.cards
        
        return resBoard
    } catch (error) {
        throw error
    }
}

export const boardService = {
    createNew,
    getDetails
}