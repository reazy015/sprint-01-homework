import {Request} from 'express'
import * as core from 'express-serve-static-core'

export interface CustomRequest<Body, URIParams = core.ParamsDictionary> extends Request<URIParams> {
  body: Body
}

export type IdURIParam = {
  id: string
}
