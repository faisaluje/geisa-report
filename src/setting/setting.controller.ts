import { Controller, Get, Patch, UseGuards, Body } from '@nestjs/common'
import { SettingService } from './setting.service'
import * as config from 'config'
import { Setting } from 'src/entities/Setting.entity'
import { AuthGuard } from '@nestjs/passport'

const prefixConfig = config.get('prefix')

@UseGuards(AuthGuard())
@Controller(`${prefixConfig.backend}/setting`)
export class SettingController {
  constructor(private settingService: SettingService) {}

  @Get('/')
  async getSetting(): Promise<Setting[]> {
    return await this.settingService.getSetting()
  }

  @Patch('/')
  async updateSetting(@Body() body: Setting[]): Promise<void> {
    return await this.settingService.updateSetting(body)
  }
}
