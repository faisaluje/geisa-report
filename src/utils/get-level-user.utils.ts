import { Peran } from 'src/enums/peran.enum'

export default function getLevelUser(peran: Peran): number {
  switch (peran) {
    case Peran.KABKOTA:
      return 2
    case Peran.PROPINSI:
      return 1
    case Peran.UPTD:
      return 3
    default:
      return 0
  }
}
