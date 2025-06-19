<?php

namespace App\Http\Controllers\PaketSoal;

use App\Http\Controllers\Controller;
use App\Models\JadwalUjian;
use Illuminate\Http\Request;
use App\Models\JadwalUjianSoal;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaketSoalController extends Controller
{
    public function index(Request $request)
    {
        $jadwalUjian = JadwalUjian::select('id_ujian', 'nama_ujian', 'id_event', 'kode_part')
            ->with('event:id_event,nama_event')
            ->get();

        $jadwalUjianSoal = JadwalUjianSoal::select('id_ujian','total_soal')->get();

        return Inertia::render('master-data/paket-soal/paket-soal-manager', [
            'jadwalUjian' => $jadwalUjian,
            'jadwalUjianSoal' => $jadwalUjianSoal,
        ]);
    }
    
    public function list()
    {
        // Ambil semua paket soal (bisa tambahkan filter sesuai kebutuhan)
        $paketSoal = JadwalUjian::select('id_ujian', 'nama_ujian')->get();
        return response()->json($paketSoal);
    }
}
