import { env } from '~/config/environment'

export const WHITELIST_DOMAINS = [
  'https://trello-web-blue-pi.vercel.app'
]

export const CLIENT_ROOT = env.BUILD_MODE === 'dev' ? 'http://localhost:5173' : 'https://trello-web-blue-pi.vercel.app'

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const BOARD_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member'
}

export const CARD_MEMBERS_ACTION = {
  JOIN: 'join',
  LEAVE: 'leave'
}

export const BOARD_INVITATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
}


export const DEFAULT_ITEMS_PER_PAGE = 18
export const DEFAULT_CURRENT_PAGE = 1