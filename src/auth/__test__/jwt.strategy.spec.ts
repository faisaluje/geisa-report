import { UnauthorizedException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserDto } from 'src/dto/user.dto'

import { Pengguna } from '../../entities/pengguna.entity'
import { PenggunaTestGeisa } from '../../entities/pengguna.testgeisa.entity'
import { HakAkses } from '../../enums/hak-akses.enum'
import { JwtStrategy } from '../jwt.strategy'

const mockPengguna = () => ({
  findOne: jest.fn(),
})

const mockPenggunaTestGeisa = () => ({
  findOne: jest.fn(),
})

const mockPayload: UserDto = {
  id: 'id',
  nama: 'nama',
  username: 'username',
  peran: 1,
  hakAkses: HakAkses.APPROVAL,
  kodeWilayah: '0',
  instansi: 'instansi',
}

describe('JwtStrategy', () => {
  describe('validate', () => {
    let jwtStrategy: JwtStrategy

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [JwtStrategy],
      }).compile()

      jwtStrategy = module.get(JwtStrategy)
    })

    it('given an existing username in DB new_geisa and successful return itself', async () => {
      Pengguna.findOne = jest.fn().mockResolvedValue({ username: 'username' })
      PenggunaTestGeisa.findOne = jest.fn()

      expect(Pengguna.findOne).not.toBeCalled()

      const result = await jwtStrategy.validate(mockPayload)

      expect(Pengguna.findOne).toBeCalledWith({ username: 'username' })
      expect(PenggunaTestGeisa.findOne).not.toBeCalled()

      expect(result).toEqual(mockPayload)
    })

    it('given an existing username in DB testgeisa rather than new_geisa and successful return itself', async () => {
      Pengguna.findOne = jest.fn().mockResolvedValue(null)
      PenggunaTestGeisa.findOne = jest
        .fn()
        .mockResolvedValue({ username: 'username' })

      const result = await jwtStrategy.validate(mockPayload)

      expect(PenggunaTestGeisa.findOne).toBeCalledWith({ username: 'username' })

      expect(result).toEqual(mockPayload)
    })

    it('throw an error for given the username that does not exists neither new_geisa and testgeisa', () => {
      Pengguna.findOne = jest.fn().mockResolvedValue(null)
      PenggunaTestGeisa.findOne = jest.fn().mockResolvedValue(null)

      expect(jwtStrategy.validate(mockPayload)).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })
})
