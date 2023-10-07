import {RESOLUTIONS_STRING} from '../utils/constants'

export const VIDEO_VALIDATION_FIELDS = {
  ID: 'id',
  TITLE: 'title',
  AUTHOR: 'author',
  AVAILABLE_RESOLUTIONS: 'availableResolutions',
  CAN_BE_DOWNLOADED: 'canBeDownloaded',
  MIN_AGE_RESTRICTION: 'minAgeRestriction',
  PUBLICATION_DATE: 'publicationDate',
}

export const BLOG_VALIDATION_FIELDS = {
  NAME: 'name',
  DESCRIPTION: 'description',
  WEBSITE_URL: 'websiteUrl',
  SORT_DIRECTION: 'sortDirection',
  SORT_BY: 'sortBy',
  PAGE_SIZE: 'pageSize',
  PAGE_NUMBER: 'pageNumber',
  SEARCH_NAME_TERM: 'searchNameTerm',
}

export const POST_VALIDATION_FIELDS = {
  TITLE: 'title',
  SHORT_DESCRIPTION: 'shortDescription',
  CONTENT: 'content',
  BLOG_ID: 'blogId',
  ID: 'id',
  SORT_DIRECTION: 'sortDirection',
  SORT_BY: 'sortBy',
  PAGE_SIZE: 'pageSize',
  PAGE_NUMBER: 'pageNumber',
}

export const ERROR_MESSAGES = {
  [VIDEO_VALIDATION_FIELDS.ID]: 'Can not be empty, only numeric accepted',
  [VIDEO_VALIDATION_FIELDS.TITLE]: 'Can not be empty, from 3 to 40 symbols length',
  [VIDEO_VALIDATION_FIELDS.AUTHOR]: 'Can not be empty, from 3 to 20 symbols length',
  [VIDEO_VALIDATION_FIELDS.AVAILABLE_RESOLUTIONS]:
    'Can not be empty, possible values are ' + RESOLUTIONS_STRING,
  [VIDEO_VALIDATION_FIELDS.CAN_BE_DOWNLOADED]: 'Can be only of boolean type',
  [VIDEO_VALIDATION_FIELDS.MIN_AGE_RESTRICTION]:
    'Can be only of integer type in range from 1 to 18',
  [VIDEO_VALIDATION_FIELDS.PUBLICATION_DATE]: 'Can be only of string type',
}

export const BLOG_ERROR_MESSAGES = {
  [BLOG_VALIDATION_FIELDS.SORT_BY]: 'Can not be null if specified, only string allowed',
  [BLOG_VALIDATION_FIELDS.SORT_DIRECTION]:
    'Can not be null if specified, only "asc" or "desc" values',
  [BLOG_VALIDATION_FIELDS.PAGE_NUMBER]: 'Can not be null if specified, only integers allowed',
  [BLOG_VALIDATION_FIELDS.PAGE_SIZE]: 'Can not be null if specified, only integers allowed',
  [BLOG_VALIDATION_FIELDS.NAME]: 'Max length 15',
  [BLOG_VALIDATION_FIELDS.DESCRIPTION]: 'Max length 500',
  [BLOG_VALIDATION_FIELDS.WEBSITE_URL]:
    'Max length 100, should match regexp ^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$',
}

export const POST_ERROR_MESSAGES = {
  [POST_VALIDATION_FIELDS.SORT_BY]: 'Can not be null if specified, only string allowed',
  [POST_VALIDATION_FIELDS.SORT_DIRECTION]:
    'Can not be null if specified, only "asc" or "desc" values',
  [POST_VALIDATION_FIELDS.PAGE_NUMBER]: 'Can not be null if specified, only integers allowed',
  [POST_VALIDATION_FIELDS.PAGE_SIZE]: 'Can not be null if specified, only integers allowed',
  [POST_VALIDATION_FIELDS.TITLE]: 'Can not be empty, from 3 to 30 symbols length',
  [POST_VALIDATION_FIELDS.CONTENT]: 'Can not be empty, from 3 to 1000 symboles length',
  [POST_VALIDATION_FIELDS.SHORT_DESCRIPTION]: 'Can not be empty, from 3 to 100 symbols',
  [POST_VALIDATION_FIELDS.BLOG_ID]: 'Can not be empty, blog must exists',
  BLOG_NOT_EXISTS_ERROR: 'Blog with this ID does not exists',
}

export const COMMON_ERROR_MESSAGE = {
  INVALID_ID: 'Invalid id, must be correct mongo object id',
}
