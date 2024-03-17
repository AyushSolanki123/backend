
import { Schema, Types  } from 'mongoose';
import { mongoDbCollectionNames } from '../../constants';
import { Log } from '../../interfaces';
const {ObjectId} = Types;


export const LogSchema: Schema = new Schema<Log>({
  _id: {
    type: String, 
    required: true, 
    default: new ObjectId().toString()
  },
  level: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    required: true 
  },
  author: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String,
    required: true 
  },
  body: {
    type: String, 
    required: true 
  },
}, {
  timestamps: true,
  collection: mongoDbCollectionNames.logs
});