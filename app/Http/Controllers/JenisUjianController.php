<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Bidang;
use Illuminate\Http\JsonResponse;

class JenisUjianController extends Controller
{
    public function index(): JsonResponse
    {
        $data = Bidang::select('kode', 'nama')->get();
        return response()->json($data); // <- ini penting
    }
    
}
