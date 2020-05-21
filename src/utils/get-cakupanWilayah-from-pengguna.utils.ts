import { UserDto } from '../dto/user.dto'
import { Pengguna } from '../entities/pengguna.entity'

export default async function getCakupanWilayahFromPengguna(
  user: UserDto,
): Promise<string[]> {
  try {
    const pengguna = await Pengguna.findOneOrFail(user.id)

    return pengguna.cakupanWilayah || ['']
  } catch (e) {
    return ['']
  }
}
