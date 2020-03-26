import {
  PERAN_KABKOTA,
  PERAN_UPTD,
  PERAN_PROPINSI,
} from 'src/constants/peran.constant'

export default function getBentukPendidikanIdFromPeran(
  peran: number,
): number[] {
  switch (peran) {
    case PERAN_KABKOTA:
    case PERAN_UPTD:
      return [1, 5, 6]
    case PERAN_PROPINSI:
    case PERAN_UPTD:
      return [7, 8, 13, 14, 15, 29]
    default:
      // PERAN_ADMIN
      return [1, 5, 6, 7, 8, 13, 14, 15, 29]
  }
}
