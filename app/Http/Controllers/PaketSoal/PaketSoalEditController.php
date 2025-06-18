<?php

namespace App\Http\Controllers\PaketSoal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bidang;
use App\Models\Event;
use App\Models\JadwalUjianSoal;
use App\Models\JadwalUjian;
use Inertia\Inertia;

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

    // PaketSoalEditController.php

    public function store(Request $request)
    {
        $request->validate([
            'nama_ujian' => 'required|string|max:255',
            'id_event' => 'required|integer|exists:data_db.t_event,id_event',
            'kode_part' => 'required|integer|exists:data_db.m_bidang,kode',
        ]);

        $kode_kelas = null;

        $jadwalUjian = JadwalUjian::create([
            'nama_ujian' => $request->input('nama_ujian'),
            'kode_kelas' => $kode_kelas,
            'id_event' => $request->input('id_event'),
            'kode_part' => $request->input('kode_part'),
        ]);

        $ujiaSoal = 0;
        $totalSoal = 0;
        $jadwalUjianSoal = JadwalUjianSoal::create([
            'id_ujian' => $jadwalUjian->id_ujian,
            'kd_bidang' => $request->input('kode_part'),
            'total_soal' => $totalSoal,
            'ujian_soal' => $ujiaSoal
        ]);

        // Redirect ke halaman index atau create lagi
        return redirect()->route('master-data.paket-soal.create')->with('success', 'Paket soal berhasil dibuat!');
    }

    public function create()
    {
        // Memanggil view inertia untuk halaman create paket soal
        return Inertia::render('master-data/paket-soal/CreatePaketSoal');
    }
}
