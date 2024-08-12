import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiError from '~/utils/ApiError'

const LIMIT_COMMON_FILE_SIZE = 10 * 1024 * 1024 // 10Mb
const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']


const fileFiler = (req, file, callback) => {
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    return callback(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Type file is invalid!'), false)
  }
  return callback(null, true)
}

const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: fileFiler
})

export const uploadMiddleware = {
  upload
}
