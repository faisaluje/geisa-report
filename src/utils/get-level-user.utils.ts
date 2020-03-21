export default function getLevelUser(peran: number): number {
  switch (peran) {
    case 2:
      return 2
    case 3:
      return 1
    case 11:
      return 3
    default:
      return 0
  }
}
