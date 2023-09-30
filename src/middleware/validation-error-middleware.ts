import {Request, Response, NextFunction} from 'express'
import {validationResult} from 'express-validator'
import {HTTP_STATUSES} from '../utils/constants'

export const validationErrorMiddleware = async (
  req: Request,
  res: Response<{
    errorsMessages: {
      field: string
      message: string
    }[]
  }>,
  next: NextFunction,
) => {
  const errors = await validationResult(req)

  if (!errors.isEmpty()) {
    res.status(HTTP_STATUSES.BAD_REQUEST).send({
      errorsMessages: Object.entries(errors.mapped()).map(([key, value]) => ({
        field: key,
        message: value.msg,
      })),
    })
    return
  }

  next()
}
