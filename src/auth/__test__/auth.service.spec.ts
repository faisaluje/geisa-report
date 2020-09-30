import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { md5 } from 'locutus/php/strings'

import { Pengguna } from '../../entities/pengguna.entity'
import { PenggunaTestGeisa } from '../../entities/pengguna.testgeisa.entity'
import { Sekolah } from '../../entities/sekolah.entity'
import { HakAkses } from '../../enums/hak-akses.enum'
import { validatePasswordMd5, validatePasswordSha1 } from '../../security/process-password.security'
import { AuthService } from '../auth.service'

const mockCredentials = {
  username: 'user',
  password: 'pass',
}

const mockJwtService = () => ({
  sign: jest.fn(),
})

describe('AuthService', () => {
  let authService: AuthService
  let jwtService: JwtService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile()

    authService = module.get(AuthService)
    jwtService = module.get(JwtService)
  })

  describe('signIn', () => {
    it('given a valid username and return the string', async () => {
      authService.validateUserPassword = jest
        .fn()
        .mockResolvedValue({ username: test })
      // @ts-ignore
      jwtService.sign.mockReturnValue('jwtPayload')

      expect(authService.validateUserPassword).not.toBeCalled()

      const result = await authService.signIn(mockCredentials)

      expect(authService.validateUserPassword).toBeCalledWith(mockCredentials)
      expect(result).toEqual('jwtPayload')
    })

    it('throw an error for given invalid username', () => {
      authService.validateUserPassword = jest.fn().mockResolvedValue(null)

      expect(authService.signIn(mockCredentials)).rejects.toThrow(
        UnauthorizedException,
      )
      expect(jwtService.sign).not.toBeCalled()
    })
  })

  describe('validateUserPassword', () => {
    let pengguna: any

    beforeEach(() => {
      pengguna = {
        penggunaId: 'id',
        nama: 'nama',
        username: 'user',
        password: 'pass',
        peranId: 1,
        hakAkses: HakAkses.MONITORING,
      }
    })

    it('given a valid admin username & password in DB new_geisa and successful return itself', async () => {
      Pengguna.findOne = jest.fn().mockResolvedValue(pengguna)
      PenggunaTestGeisa.findOne = jest.fn()
      authService.validatePassword = jest.fn().mockReturnValue(true)

      expect(Pengguna.findOne).not.toBeCalled()
      expect(authService.validatePassword).not.toBeCalled()

      const result = await authService.validateUserPassword(mockCredentials)

      expect(PenggunaTestGeisa.findOne).not.toBeCalled()
      expect(Pengguna.findOne).toBeCalledWith({ username: 'user' })
      expect(authService.validatePassword).toBeCalledWith(
        'pass',
        mockCredentials.password,
      )

      expect(result).toBeInstanceOf(Object)
    })

    it('given a valid admin username & password in DB testgeisa and successful return itself', async () => {
      Pengguna.findOne = jest.fn().mockResolvedValue(null)
      PenggunaTestGeisa.findOne = jest.fn().mockResolvedValue(pengguna)
      authService.validatePassword = jest.fn().mockReturnValue(true)

      const result = await authService.validateUserPassword(mockCredentials)

      expect(Pengguna.findOne).toBeCalledWith({ username: 'user' })
      expect(PenggunaTestGeisa.findOne).toBeCalledWith({ username: 'user' })
      expect(authService.validatePassword).toBeCalledWith(
        'pass',
        mockCredentials.password,
      )

      expect(result).toBeInstanceOf(Object)
    })

    it('call Sekolah.findOne() when pengguna.peranId === 10', async () => {
      Pengguna.findOne = jest
        .fn()
        .mockResolvedValue({ ...pengguna, peranId: 10, sekolahId: 'sekolahId' })
      authService.validatePassword = jest.fn().mockReturnValue(true)
      Sekolah.findOne = jest.fn().mockResolvedValue({ sekolahId: 'sekolahId' })

      const result = await authService.validateUserPassword(mockCredentials)

      expect(Sekolah.findOne).toBeCalledWith('sekolahId')
      expect(result).toBeInstanceOf(Object)
    })

    it('return null if given invalid credential in db new_geisa', () => {
      Pengguna.findOne = jest.fn().mockResolvedValue(null)
      PenggunaTestGeisa.findOne = jest.fn().mockResolvedValue(null)
      authService.validatePassword = jest.fn().mockReturnValue(false)

      expect(
        authService.validateUserPassword(mockCredentials),
      ).resolves.toBeNull()
    })
  })

  describe('validatePassword', () => {
    const encryptedPassword = '23u10usdknfkdsfn'
    const plainPassword = 'pass'

    it('return true if password using md5 hash', () => {
      // @ts-ignore
      validatePasswordMd5 = jest.fn().mockReturnValue(true)
      // @ts-ignore
      validatePasswordSha1 = jest.fn()

      expect(validatePasswordMd5).not.toBeCalled()

      const result = authService.validatePassword(
        encryptedPassword,
        plainPassword,
      )

      expect(validatePasswordSha1).not.toBeCalled()
      expect(validatePasswordMd5).toBeCalledWith(
        encryptedPassword,
        plainPassword,
      )
      expect(result).toEqual(true)
    })

    it('return true if password using sha1 hash', () => {
      // @ts-ignore
      validatePasswordMd5 = jest.fn().mockReturnValue(false)
      // @ts-ignore
      validatePasswordSha1 = jest.fn().mockReturnValue(true)
      // @ts-ignore
      md5 = jest.fn().mockReturnValue('md5Pass')

      const result = authService.validatePassword(
        encryptedPassword,
        plainPassword,
      )

      expect(md5).toBeCalled()
      expect(validatePasswordSha1).toBeCalledWith(encryptedPassword, 'md5Pass')
      expect(result).toEqual(true)
    })

    it('return false if password is wrong when use md5 or sha1', () => {
      // @ts-ignore
      validatePasswordMd5 = jest.fn().mockReturnValue(false)
      // @ts-ignore
      validatePasswordSha1 = jest.fn().mockReturnValue(false)

      const result = authService.validatePassword(
        encryptedPassword,
        plainPassword,
      )

      expect(result).toEqual(false)
    })
  })
})
