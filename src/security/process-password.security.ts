import { md5, sha1 } from 'locutus/php/strings'

export const validatePasswordMd5 = (
  encryptedPassword: string,
  plainPassword: string,
): boolean => {
  return encryptedPassword === md5(plainPassword)
}

export const validatePasswordSha1 = (
  encryptedPassword: string,
  plainPassword: string,
): boolean => {
  return encryptedPassword === sha1(md5(plainPassword))
}
