import jwt from 'jsonwebtoken'

const generateToken = (user = {}, secretSignature, tokenLife) => {
  try {
    return jwt.sign(user, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) {
    throw new Error(error)
  }
}

const verifyToken = (secretSignature, token) => {
  try {
    return jwt.verify(token, secretSignature)
  } catch (error) {
    throw new Error(error)
  }
}

export const jwtProvider = {
  generateToken,
  verifyToken
}