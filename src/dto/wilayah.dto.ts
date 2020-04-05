export class WilayahDto {
  kodeWilayah: string
  nama: string
  idLevelWilayah: number
  mstWilayah?: WilayahDto
  mstKodeWilayah?: string
  mstNama?: string
  kodeKecamatan?: string
  namaKecamatan?: string
  kodeKabKota?: string
  namaKabKota?: string
  kodeProvinsi?: string
  namaProvinsi?: string
}
