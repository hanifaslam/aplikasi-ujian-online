<?php

namespace App\Http\Controllers;

use App\Models\Penjadwalan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MonitoringUjianController extends Controller
{
    /**
     * Display a listing of monitoring ujian.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $page = $request->input('page', 1);

        // Eager load both event and jenis_ujian relationships
        $query = Penjadwalan::with(['event', 'jenis_ujian']);

        // Apply search filter if provided
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('jenis_ujian', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%");
                })
                    ->orWhereHas('event', function ($q) use ($search) {
                        $q->where('nama_event', 'like', "%{$search}%");
                    })
                    ->orWhere('jenis_ujian', 'like', "%{$search}%");
            });
        }

        $ujianList = $query->paginate($perPage);

        // Transform the data to match the expected format in the frontend
        $ujianList->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id_penjadwalan,
                'tipe_ujian' => $item->tipe_ujian,
                'paket_ujian' => $item->paket_ujian,
                'kelas_prodi' => $item->kelas_prodi,
                'tanggal_ujian' => $item->tanggal ? $item->tanggal->format('Y-m-d') : null,
                'mulai' => $item->mulai,
                'selesai' => $item->selesai,
                'kuota' => $item->kuota,
                'tipe' => $item->tipe,
            ];
        });

        return Inertia::render('monitoring/monitoring', [
            'ujianList' => $ujianList,
            'filters' => [
                'search' => $search,
                'perPage' => $perPage,
                'page' => $page,
            ],
        ]);
    }

    /**
     * Display the specified monitoring ujian.
     */
    public function show($id)
    {
        $ujian = Penjadwalan::with(['event', 'jenis_ujian'])->findOrFail($id);

        // Transform to expected format
        $transformedUjian = [
            'id' => $ujian->id_penjadwalan,
            'tipe_ujian' => $ujian->tipe_ujian,
            'paket_ujian' => $ujian->paket_ujian,
            'kelas_prodi' => $ujian->kelas_prodi,
            'tanggal_ujian' => $ujian->tanggal ? $ujian->tanggal->format('Y-m-d') : null,
            'mulai' => $ujian->mulai,
            'selesai' => $ujian->selesai,
            'kuota' => $ujian->kuota,
            'tipe' => $ujian->tipe,
        ];

        return Inertia::render('monitoring/detail', [
            'ujian' => $transformedUjian,
        ]);
    }
}
