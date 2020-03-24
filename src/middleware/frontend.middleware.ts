import { NestMiddleware, Injectable } from '@nestjs/common'
import { resolve } from 'path'

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const { baseUrl } = req
    if (baseUrl.indexOf('/api') === 0) {
      next()
    } else {
      res.sendFile(resolve('public/index.html'))
    }
  }
}
