import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import { env } from '~/config/environment'

cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_API_KEY,
  api_secret: env.CLOUD_API_KEY_SECRET
})

const uploadStream = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream({ folder: folder }, (error, uploadResult) => {
      if (error) {
        reject(error)
      } else {
        resolve(uploadResult)
      }
    })

    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

export const cloudinaryProvider = {
  uploadStream
}