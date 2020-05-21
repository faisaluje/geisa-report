import { Pengguna } from '../entities/pengguna.entity'
import { PenggunaTestGeisa } from '../entities/pengguna.testgeisa.entity'

export default async function getSekolahIdFromPenggunaId(
  penggunaId: string,
): Promise<string> {
  const pengguna =
    (await Pengguna.findOne(penggunaId)) ||
    (await PenggunaTestGeisa.findOne(penggunaId))
  if (pengguna) {
    return pengguna.sekolahId
  } else {
    return ''
  }
}
