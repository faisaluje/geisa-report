import { Pengguna } from 'src/entities/pengguna.entity'

export default async function getSekolahIdFromPenggunaId(
  penggunaId: string,
): Promise<string> {
  const pengguna = await Pengguna.findOne(penggunaId)
  if (pengguna) {
    return pengguna.sekolahId
  } else {
    return ''
  }
}
