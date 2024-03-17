/* eslint-disable @typescript-eslint/naming-convention */
import mongoose from 'mongoose'

const mongodb_prefix = process.env.MONGODB_PREFIX ?? 'mongodb'
const mongodb_user = process.env.MONGODB_USER ?? 'admin'
const mongodb_password = process.env.MONGODB_PASSWORD ?? 'passoword'
const mongodb_host = process.env.MONGODB_HOST ?? 'localhost'
const mongodb_port = process.env.MONGODB_PORT ?? '27017'
const mongodb_db = process.env.MONGODB_DB ?? 'Chatify'

const nosqlConfig = {
  prefix: mongodb_prefix,
  user: mongodb_user,
  password: mongodb_password,
  host: mongodb_host,
  port: mongodb_port,
  db: mongodb_db
}

const getMongoDbConnectionString = (): string => {
  const { prefix, user, password, host, port, db } = nosqlConfig
  return prefix === 'mongodb' ? `${prefix}://${user}:${password}@${host}:${port}/${db}` : `${prefix}://${user}:${password}@${host}/${db}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMongoDbConnection = async (): Promise<any> => {
  const mongodbUri = getMongoDbConnectionString()

  try {
    return mongoose.createConnection(mongodbUri)
  } catch (error) {
    return error
  }
}
