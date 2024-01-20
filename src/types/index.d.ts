export {}

declare global {
  namespace Express {
    export interface Request {
      context: {
        userId: stirng
        email: string
        login: string
        refreshTokenExp?: number
        refreshTokenIat?: number
      }
    }
  }
}
