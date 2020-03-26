import {
  PERAN_KABKOTA,
  PERAN_PROPINSI,
  PERAN_UPTD,
} from 'src/constants/peran.constant'

export default function getLevelUser(peran: number): number {
  switch (peran) {
    case PERAN_KABKOTA:
      return 2
    case PERAN_PROPINSI:
      return 1
    case PERAN_UPTD:
      return 3
    default:
      return 0
  }
}
