<?php

namespace App\Http\Controllers\PaketSoal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bidang;
use App\Models\Event;
use App\Models\JadwalUjianSoal;
use App\Models\JadwalUjian;

class PaketSoalEditController extends Controller
{
    public function edit($id)
    {
        $event = Event::with('jadwalUjian', 'jadwalUjianSoal')->findOrFail($id);

        $bidangs = Bidang::all();

        return view('paket-soal.edit', compact('event', 'bidangs'));
    }


    public function update(Request $request, $id)
    {
        
    }

    public function create(Request $request)
    {
        $request->validate([
            'bidang' => 'required|integer|exists:data_db.m_bidang,kode',
            'nama_event' => 'required|string|max:255',
            'soal' => 'nullable|array',
            'soal.*' => 'nullable|integer|exists:data_db.t_soal,id',
        ]);

        $event = Event::create(
        [
            'nama_event' => $request->input('nama_event'),
            'status' => 1,
        ]);

        $penjadwalan_ujian = $event->jadwalUjian()->create([
            'nama_ujian' => $request->input('bidang'),
            'kode_kelas' => $request->input('kode_kelas', null),
            'id_event' => $event->id_event,
            // 'kode_part' => $request->input('bidang'),
        ]);

        $penjadwalan_ujian_soal = JadwalUjianSoal::create([
            'kd_bidang' => $request->input('bidang'),
            'total_soal' => count($request->input('soal', [])),
            'ujian_soal' => $request->input('soal', []),
        ]);
    }

    // PaketSoalEditController.php

    public function store(Request $request)
    {
        $request->validate([
            'nama_ujian' => 'required|string|max:255',
            'kode_kelas' => 'required|string|exists:data_db.tbkelas,ID',
            'id_event' => 'required|integer|exists:data_db.t_event,id_event',
            'kode_part' => 'required|integer|exists:data_db.m_bidang,kode',
            'soal' => 'required|array',
            'soal.*' => 'required|integer|exists:data_db.t_soal,ids',
        ]);

        $jadwalUjian = JadwalUjian::create([
            'nama_ujian' => $request->input('nama_ujian'),
            'kode_kelas' => $request->input('kode_kelas'),
            'id_event' => $request->input('id_event'),
            'kode_part' => $request->input('kode_part'),
        ]);

        $jadwalUjianSoal = JadwalUjianSoal::create([
            'kd_bidang' => $request->input('kode_part'),
            'total_soal' => count($request->input('soal')),
            'ujian_soal' => $request->input('soal'),
        ]);

        return response()->json([
            'message' => 'Paket soal berhasil dibuat',
            'jadwal_ujian' => $jadwalUjian,
            'jadwal_ujian_soal' => $jadwalUjianSoal,
        ], 201);
    }
}
