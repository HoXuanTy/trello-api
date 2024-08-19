import { slugify } from '~/utils/formatters'
import { Board, boardModel } from '~/models/boardModel'
import { ObjectId } from 'mongodb'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

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

const getBoards = async () => {
    try {
        const boards = await boardModel.getBoards()
        return boards
    } catch (error) {
        throw error
    }
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
const moveCardToDifferentColumn = async (reqBody: {
    currentCardId: ObjectId,
    prevColumnId: ObjectId,
    prevCardOrderIds: ObjectId[],
    nextColumnId: ObjectId,
    nextCardOrederIds: ObjectId[],
}) => {
    try {
        //updates the cardOrderIds array of the original Column that contains it
        await columnModel.update(reqBody.prevColumnId, {
            cardOrderIds: reqBody.prevCardOrderIds,
            updatedAt: Date.now()
        })
        //Update the cardOrderIds array of the next Column
        await columnModel.update(reqBody.nextColumnId, {
            cardOrderIds: reqBody.nextCardOrederIds,
            updatedAt: Date.now()
        })
        //Update the new ColumnId of the dragged Card
        await cardModel.update(reqBody.currentCardId, {
            columnId: reqBody.nextColumnId,
            updatedAt: Date.now()
        })

        return { updateResult: "move card successfully"}
    } catch (error) {
        throw error
    }
}


export const boardService = {
    createNew,
    getDetails,
    update,
    moveCardToDifferentColumn,
    getBoards
}