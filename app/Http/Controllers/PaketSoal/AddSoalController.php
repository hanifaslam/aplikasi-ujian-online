<?php

namespace App\Http\Controllers\PaketSoal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JadwalUjian;
use App\Models\JadwalUjianSoal;

class AddSoalController extends Controller
{
    public function addSoal(Request $request)
    {
        // Validasi input
        $request->validate([
            'paket_soal_id' => 'required|integer|exists:data_db.t_event,id_event',
            'soal' => 'required|string|max:1000|exists:m_soal,ids',
        ]);

        // Simpan soal ke database
        $jadwalUjian = JadwalUjian::findOrFail($request->input('paket_soal_id'));
        
        //create paket soal baru
        $jadwalUjianNew = new JadwalUjian();
        $jadwalUjianNew->nama_ujian = $jadwalUjian->nama_ujian;
        $jadwalUjianNew->kode_kelas = $jadwalUjian->kode_kelas;
        $jadwalUjianNew->id_event = $jadwalUjian->id_event;
        $jadwalUjianNew->kode_part = $jadwalUjian->kode_part;
        $jadwalUjianNew->save();

        $jadwalUjianSoal = JadwalUjianSoal::findOrFail($request->input('paket_soal_id'));
        $jadwalUjianSoalNew = new JadwalUjianSoal();
        $jadwalUjianSoalNew->id_ujian = $jadwalUjianNew->id_ujian;
        $jadwalUjianSoalNew->kd_bidang = $jadwalUjianSoal->kd_bidang;
        $jadwalUjianSoalNew->ujian_soal = $request->input('soal');
        $jadwalUjianSoalNew->total_soal = count($request->input('soal'));
        $jadwalUjianSoalNew->save();
    }
}
