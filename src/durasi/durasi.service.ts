import { Injectable } from '@nestjs/common';
import { PengaturanDurasi } from 'src/entities/pengaturanDurasi.entity';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { Pengguna } from 'src/entities/pengguna.entity';
import { Sekolah } from 'src/entities/sekolah.entity';
import { RefAnggotaDinas } from 'src/entities/refAnggotaDinas.entity';
import { getConnection } from 'typeorm';

@Injectable()
export class DurasiService {

  async getPengaturanDurasi(user: JwtPayload): Promise<PengaturanDurasi[]> {
    const kodeWilayah = await this.getKodeWilayah(user)
    if (!kodeWilayah) return null
    
    const pengaturanDurasi = await PengaturanDurasi.find({ kodeWilayah })
    if (pengaturanDurasi.length === 0){
      return this.initPengaturanDurasi(kodeWilayah, user.username)
    } else {
      return pengaturanDurasi
    }
  }

  async initPengaturanDurasi(kodeWilayah: string, username: string): Promise<PengaturanDurasi[]> {
    const rows: PengaturanDurasi[] = []
    
    for (let idx = 0; idx < 7; idx++) {
      const data = new PengaturanDurasi()
      data.kodeWilayah = kodeWilayah
      data.hari = idx
      data.jamMasuk = '07:00:00'
      data.jamPulang = '14:00:00'
      data.createDate = new Date()
      data.updatedBy = username

      rows.push(data)
    }

    if (await getConnection().manager.save(rows)) {
      return rows
    } else {
      return null
    }
  }

  async getKodeWilayah(user: JwtPayload): Promise<string> {
    switch (user.peran) {
      case 1:
        return this.getKodeWilayahBySekolah(user.username)
      case 2:
        return this.getKodeWilayahByDinas(user.username)
    }
    
    return null
  }

  async getKodeWilayahBySekolah(username: string): Promise<string> {
    const user = await Pengguna.findOne({ username })
    if (!user) return null

    const userSekolah = await Sekolah.findOne(user.sekolahId)
    if (!userSekolah) return null

    if ([1,5,6].includes(userSekolah.bentukPendidikanId)) {
      return userSekolah.kodeWilayahKabupatenKota
    } else if([7,8,13,14,15,29].includes(userSekolah.bentukPendidikanId)) {
      return userSekolah.kodeWilayahProvinsi
    } else {
      return null
    }
  }

  async getKodeWilayahByDinas(username: string): Promise<string> {
    const user = await RefAnggotaDinas.findOne({ userIdDinas: username })
    if (!user) return null

    let kodeWilayah = user.kabupatenKotaIdList
    if (kodeWilayah) {
      kodeWilayah = JSON.parse(kodeWilayah)
    } else { return null}

    kodeWilayah = typeof kodeWilayah === 'object' ? kodeWilayah[0] : kodeWilayah

    if (kodeWilayah.length === 5) {
      kodeWilayah = `0${kodeWilayah}`
    }

    return kodeWilayah
  }
}
