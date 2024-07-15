
export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const EMAIL_RULE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
export const PASSWORD_RULE = /^(?=.*\d)(?=.*[a-z]).{8,}$/i
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!'