import {Request, Response, NextFunction} from 'express'
import {validationResult} from 'express-validator'

export const validationErrorMiddleware = (
  req: Request,
  res: Response<{
    errorsMessages: {
      field: string
      message: string
    }[]
  }>,
  next: NextFunction,
) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400).send({
      errorsMessages: Object.entries(errors.mapped()).map(([key, value]) => ({
        field: key,
        message: value.msg,
      })),
    })
    return
  }

  next()
}
