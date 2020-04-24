import {
  Injectable,
  NestMiddleware,
  Logger,
  ForbiddenException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { SettingService } from 'src/setting/setting.service'
import { getMethodName } from 'src/services/ClassHelpers'
import { JwtService } from '@nestjs/jwt'
import { UserDto } from 'src/dto/user.dto'
import { Peran } from 'src/enums/peran.enum'

const logger = new Logger('maintenance-middleware')

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  private exceptUrl = ['signin']
  private deskripsi = 'Maintenance'
  private info = 'Info Maintenance'

  constructor(
    private readonly settingService: SettingService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, _res: Response, next: () => void): Promise<void> {
    const { url } = req
    if (this.exceptUrl.find(val => url.search(val) >= 0)) {
      return next()
    }

    try {
      const token = req.headers.authorization?.split(' ')[1]
      const userData = token ? (this.jwtService.decode(token) as UserDto) : null

      if (userData?.peran == Peran.ADMIN) {
        return next()
      }
    } catch (e) {
      logger.error(e.toString())
    }

    const maintenanceMessage = await this.isMaintenance()

    if (maintenanceMessage) {
      throw new ForbiddenException(maintenanceMessage)
    }
    return next()
  }

  async isMaintenance(): Promise<string> {
    try {
      const data = await this.settingService.getSetting()

      const maintenance = data.find(row => row.deskripsi === this.deskripsi)

      if (maintenance.value === '1') {
        const info = data.find(row => row.deskripsi === this.info)
        return info.value
      }

      return null
    } catch (e) {
      logger.error(`${getMethodName(this.isMaintenance)}, ${e.toString()}`)
      return null
    }
  }
}
