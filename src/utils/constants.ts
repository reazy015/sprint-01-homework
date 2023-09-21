export const RESOLUTIONS = [
  'P144',
  'P240',
  'P360',
  'P480',
  'P720',
  'P1080',
  'P1440',
  'P2160',
] as const
export const RESOLUTIONS_STRING = RESOLUTIONS.join(', ')

export const ERROR_MESSAGE_FIELD = {
  AUTHOR: 'authour',
  TITLE: 'title'
}

export const ERROR_MESSAGE_TEXT = {
  AUTHOR: 'Author field must be specified, at least 4 symbols',
  TITLE: 'Title field must be specified, at least 4 symbols'
}
