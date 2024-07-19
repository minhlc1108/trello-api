import { env } from '~/config/environment'

import { MongoClient, ServerApiVersion } from 'mongodb'

let trelloDatabaseInstance = null

// khởi tạo đối tượng mongoClientInstance để connect tới MongoDB with a MongoClientOptions object to set the Stable API version
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  // gọi kết nối tới mongodb atlas với uri đã khai báo trong mongoClient
  await mongoClientInstance.connect()
  //kết nối thành công thì lấy db theo tên và gắn ngược nó vào biến trelloDatabaseInstance
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

//func GET DB export ra db chung ta se dung o nhiều nơi khác nhau trong code
// chỉ gọi sau khi kết nối thành công
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect database firsts')
  return trelloDatabaseInstance
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

