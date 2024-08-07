import { slugify } from '~/utils/formatters'
import { Board, boardModel } from '~/models/boardModel'
import { ObjectId } from 'mongodb'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

interface Column {
    _id: ObjectId
    boardId: ObjectId
    title: string
    cardOrderIds: ObjectId[]
    cards: Card[]
}

interface Card {
    _id: ObjectId
    title: string
    boardId: ObjectId
    columnId: ObjectId
}

const createNew = async (reqBody: Board) => {
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
        resBoard.columns.forEach((column: Column) => {
            column.cards = resBoard.cards.filter((card: Card) => card.columnId.equals(column._id))
        })

        delete resBoard.cards

        return resBoard
    } catch (error) {
        throw error
    }
}
const update = async (boardId: ObjectId, reqBody: Board) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }
        const updatedBoard = await boardModel.update(boardId, updateData)
        return updatedBoard 
    } catch (error) {
        throw error
    }
}


export const boardService = {
    createNew,
    getDetails,
    update
}