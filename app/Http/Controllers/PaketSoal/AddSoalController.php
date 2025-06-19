<?php

namespace App\Http\Controllers\PaketSoal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JadwalUjian;
use App\Models\JadwalUjianSoal;
use Inertia\Inertia;

class AddSoalController extends Controller
{
    
    public function addSoal(Request $request)
    {
        
    }

    public function showAddSoalForm()
    {
        // Menampilkan halaman tambah soal ke paket soal (Inertia/React)
        return Inertia::render('banksoalcheckbox');
    }
}
