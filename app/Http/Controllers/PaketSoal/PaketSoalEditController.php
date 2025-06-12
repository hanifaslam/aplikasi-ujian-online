<?php

namespace App\Http\Controllers\PaketSoal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bidang;
use App\Models\Event;
use App\Models\JadwalUjianSoal;

class PaketSoalEditController extends Controller
{
    public function edit($id)
    {
        
    }

    public function update(Request $request, $id)
    {
        $jadwalUjianSoal = JadwalUjianSoal::findOrFail($id);
        $request->validate([
            'soal' => 'nullable|array',
            'soal.*' => 'nullable|integer|exists:data_db.t_soal,id',
        ]);

        $jadwalUjianSoalNew = JadwalUjianSoal::create([
            'kd_bidang' => $jadwalUjianSoal->kd_bidang,
            'total_soal' => count($request->input('soal', [])),
            'ujian_soal' => $request->input('soal', []),
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'bidang' => 'required|integer|exists:data_db.m_bidang,kode',
            'soal' => 'nullable|array',
            'soal.*' => 'nullable|integer|exists:data_db.t_soal,id',
        ]);

        $event = Event::create(
        [
            'nama_event' => $request->input('nama_event'),
            'status' => 1,
        ]);

        $penjadwalan_ujian_soal = JadwalUjianSoal::create([
            'kd_bidang' => $request->input('bidang'),
            'total_soal' => count($request->input('soal', [])),
            'ujian_soal' => $request->input('soal', []),
        ]);
    }
}
