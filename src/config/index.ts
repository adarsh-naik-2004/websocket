import { config } from 'dotenv'
config()

export const Config = {
    server: {
        port: process.env.PORT,
    },

    kafka: {
        broker: process.env.KAFKA_BROKER ? [process.env.KAFKA_BROKER] : [''],
        sasl: {
            username: process.env.KAFKA_USERNAME,
            password: process.env.KAFKA_PASSWORD,
        },
    },

    frontend: {
        clientUI: process.env.CLIENT_UI,
        adminUI: process.env.ADMIN_UI,
    },

    env: {
        nodeEnv: process.env.NODE_ENV || 'development',
    },
}
