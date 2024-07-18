import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { jwtProvider } from '~/providers/jwtProvider'
import ApiError from '~/utils/ApiError'

const isAuthorized = (req, res, next) => {
  const accessToken = req.cookies?.accessToken
  if (!accessToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token is invalid!')
  }
  try {
    const decoded = jwtProvider.verifyToken(env.ACCESS_TOKEN_SECRET_SIGNATURE, accessToken)

    req.jwtDecoded = decoded

    next()
  } catch (error) {
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Token is expired!'))
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED))
  }
}

export const authMiddleware = {
  isAuthorized
}