import { slugify } from '~/utils/formatters'

const createNew = async (reqBody: { title: string, description: string}) => {
    try {
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title)
        }
        return newBoard
    } catch (error) {
        throw error
    }
}

export const boardService = {
    createNew
}