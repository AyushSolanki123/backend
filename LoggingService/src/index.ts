import express, { type Express, type Request, type Response } from 'express'
import dotenv from 'dotenv'
import { RabbitMQWrapper } from './utils/rabbitmq-wrapper'
import { LoggingService } from './main/services/logging.service'

dotenv.config()

const LOGGING_QUEUE = process.env.LOGGING_QUEUE ?? 'LOGGING_QUEUE'
const RABBIT_MQ_URI = process.env.RABBITMQ_URI ?? 'amqp://localhost:5672'
const PORT = process.env.PORT ?? 3000

const rabbitMQWrapper = new RabbitMQWrapper(RABBIT_MQ_URI)
const loggingService = new LoggingService()
rabbitMQWrapper.subscribe(LOGGING_QUEUE, loggingService.logHandler)

const app: Express = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`)
})

