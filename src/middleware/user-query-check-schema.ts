import {query} from 'express-validator'

export const validateQueryParamsWithDefault = [
  query('sortBy').trim().default('createdAt'),
  query('sortDir')
    .trim()
    .default('desc')
    .customSanitizer((sortDir: 'asc' | 'desc') =>
      sortDir !== 'asc' && sortDir !== 'desc' ? 'desc' : sortDir,
    ),
  query('pageSize')
    .trim()
    .toInt()
    .default(10)
    .customSanitizer((pageSize: number) => (pageSize < 1 ? 10 : pageSize)),
  query('pageNumber')
    .trim()
    .toInt()
    .default(1)
    .customSanitizer((pageNumber: number) => (pageNumber < 1 ? 1 : pageNumber)),
  query('searchEmailTerm').trim(),
  query('searchLoginTerm').trim(),
]
