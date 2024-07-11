import express, { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

const Router = express.Router()

Router.route('/')
    .get((req, res) => {
        res.status(StatusCodes.OK).json({ message: 'APIs Get' })
    })
    .post((req, res) => {
        res.status(StatusCodes.CREATED).json({ message: 'APIs Create' })
    })

export const boardRoutes = Router
