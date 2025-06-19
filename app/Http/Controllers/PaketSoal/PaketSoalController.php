<?php

namespace App\Http\Controllers\PaketSoal;

use App\Http\Controllers\Controller;
use App\Models\JadwalUjian;
use Illuminate\Http\Request;
use App\Models\PaketSoal;
use Illuminate\Support\Facades\Log;


class PaketSoalController extends Controller
{
    public function index(Request $request)
    {
        
    }
    
    public function list()
    {
        // Ambil semua paket soal (bisa tambahkan filter sesuai kebutuhan)
        $paketSoal = JadwalUjian::select('id_ujian', 'nama_ujian')->get();
        return response()->json($paketSoal);
    }
}
