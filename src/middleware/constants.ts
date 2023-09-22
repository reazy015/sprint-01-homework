import {RESOLUTIONS_STRING} from '../utils/constants'

export const POST_VIDEO_VALIDATION_FIELDS = {
  ID: 'id',
  TITLE: 'title',
  AUTHOR: 'author',
  AVAILABLE_RESOLUTIONS: 'availableResolutions',
  CAN_BE_DOWNLOADED: 'canBeDownloaded',
  MIN_AGE_RESTRICTION: 'minAgeRestriction',
  PUBLICATION_DATE: 'publicationDate',
}

export const ERROR_MESSAGES = {
  [POST_VIDEO_VALIDATION_FIELDS.ID]: 'Can not be empty, only numeric accepted',
  [POST_VIDEO_VALIDATION_FIELDS.TITLE]: 'Can not be empty, from 3 to 40 symbols length',
  [POST_VIDEO_VALIDATION_FIELDS.AUTHOR]: 'Can not be empty, from 3 to 20 symbols length',
  [POST_VIDEO_VALIDATION_FIELDS.AVAILABLE_RESOLUTIONS]:
    'Can not be empty, possible values are ' + RESOLUTIONS_STRING,
  [POST_VIDEO_VALIDATION_FIELDS.CAN_BE_DOWNLOADED]: 'Can be only of boolean type',
  [POST_VIDEO_VALIDATION_FIELDS.MIN_AGE_RESTRICTION]:
    'Can be only of integer type in range from 1 to 18',
  [POST_VIDEO_VALIDATION_FIELDS.PUBLICATION_DATE]: 'Can be only of string type',
}
