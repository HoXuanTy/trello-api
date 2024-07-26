import { MongoClient, ServerApiVersion, Db } from "mongodb"
import { env } from "./environment"

let trelloDatabaseInstance: Db | null = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
}) 

export const CONNECT_DB = async () => {
    await mongoClientInstance.connect()
    trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const GET_DB = () => {
    if (!trelloDatabaseInstance) throw new Error('Must connect to database first!')
    return trelloDatabaseInstance
}

export const CLOSE_DB = async () => {
    await mongoClientInstance.close()
}