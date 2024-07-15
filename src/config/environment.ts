import 'dotenv/config'

declare var process: {
    env: {
        MONGODB_URI: string
        DATABASE_NAME: string
        APP_HOST: string
        APP_POST: number
        BUILD_MODE: string
    }
}

export const env = {
    MONGODB_URI: process.env.MONGODB_URI,
    DATABASE_NAME: process.env.DATABASE_NAME,
    APP_HOST: process.env.APP_HOST,
    APP_POST: process.env.APP_POST,

    BUILD_MODE: process.env.BUILD_MODE
}

