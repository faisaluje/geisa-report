import { UserDto } from 'src/dto/user.dto'
import { Pengguna } from 'src/entities/pengguna.entity'

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
