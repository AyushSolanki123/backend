/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import * as amqp from 'amqplib'

export class RabbitMQWrapper {
  private connection: amqp.Connection | undefined
  private readonly connectionURI: string
  private channel: amqp.Channel | undefined
  private queue!: string
  private handlers!: Array<(message: any, ack: any) => void>

  public constructor (connectionURI: string) {
    this.connectionURI = connectionURI?.length > 0 ? connectionURI : 'amqp://localhost:5672'
  }

  private executOnce (fn: () => void): () => void {
    let executed = false
    return () => {
      if (!executed) {
        executed = true
        fn()
      }
    }
  }

  private async createChannel (): Promise<void> {
    this.channel = await this.connection?.createChannel()
  }

  private async connect (): Promise<void> {
    this.connection = await amqp.connect(this.connectionURI)
    await this.createChannel()
  }

  private unsubscribe (handler: (message: any, ack: any) => void): void {
    this.handlers = this.handlers.filter((h) => h !== handler)
  }

  public async send (queue: string, message: any): Promise<void> {
    if (!this.connection) {
      await this.connect()
    }

    if (!this.queue) {
      this.queue = queue
    }

    const buffer = Buffer.from(JSON.stringify(message))
    await this.channel?.assertQueue(this.queue, { durable: true })
    this.channel?.sendToQueue(this.queue, buffer)
  }

  public async subscribe (queue: string, handler: (message: string, ack: any) => void): Promise<any> {
    if (!this.connection) {
      await this.connect()
    }

    if (!this.queue) {
      this.queue = queue
    } else {
      const existingHandler = this.handlers.find((h) => h === handler)
      if (existingHandler) {
        return () => { this.unsubscribe(existingHandler) }
      }
    }
    this.handlers.push(handler)

    await this.channel?.assertQueue(this.queue, { durable: true })
    this.channel?.consume(this.queue, async (message) => {
      if (message) {
        const ack = this.executOnce(() => this.channel?.ack(message))
        this.handlers.forEach((h) => { h(JSON.parse(message.content.toString()), ack) })
      }
    })
    return () => { this.unsubscribe(handler) }
  }

  public async close (): Promise<void> {
    await this.channel?.close()
    await this.connection?.close()
  }
}
