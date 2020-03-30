import { Peran } from 'src/enums/peran.enum'

export default function getBentukPendidikanIdFromPeran(peran: Peran): number[] {
  switch (peran) {
    case Peran.KABKOTA:
    case Peran.UPTD:
      return [1, 5, 6]
    case Peran.PROPINSI:
    case Peran.CABDIS:
      return [7, 8, 13, 14, 15, 29]
    default:
      // PERAN_ADMIN
      return [1, 5, 6, 7, 8, 13, 14, 15, 29]
  }
}
