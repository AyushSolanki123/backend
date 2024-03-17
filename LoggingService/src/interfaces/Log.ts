export interface Log {
  _id: string;
  level: string;
  timestamp: Date;
  author: string;
  message: string;
  body: string;
}
