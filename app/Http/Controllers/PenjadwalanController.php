<?php

namespace App\Http\Controllers;

use App\Models\Penjadwalan;
use App\Models\Event;
use App\Models\MBidang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PenjadwalanController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $query = Penjadwalan::with([
            'event',           // Relasi ke Event untuk mendapatkan nama_event
            'event.jadwalUjian'
              // Event → JadwalUjian → Peserta (melalui id_event)
        ]);

        if ($search) {
            $query->where('kode_jadwal', 'like', "%{$search}%")
                ->orWhere('tipe_ujian', 'like', "%{$search}%")
                ->orWhereHas('event', function($q) use ($search) {
                    $q->where('nama_event', 'like', "%{$search}%");
                })
                ->orWhereHas('event.jadwalUjian', function($q) use ($search) {
                    $q->where('nama_ujian', 'like', "%{$search}%");
                });
        }

        $data = $query->orderBy('tanggal', 'desc')
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        // Transform data untuk menambahkan informasi dari JadwalUjian
        $data->getCollection()->transform(function ($penjadwalan) {
            return [
                'id_penjadwalan' => $penjadwalan->id_penjadwalan,
                'tanggal' => $penjadwalan->tanggal,
                'waktu_mulai' => $penjadwalan->waktu_mulai,
                'waktu_selesai' => $penjadwalan->waktu_selesai,
                'kuota' => $penjadwalan->kuota,
                'status' => $penjadwalan->status,
                'tipe_ujian' => $penjadwalan->tipe_ujian,
                'id_paket_ujian' => $penjadwalan->id_paket_ujian,
                'jenis_ujian' => $penjadwalan->jenis_ujian,
                'kode_jadwal' => $penjadwalan->kode_jadwal,
                'online_offline' => $penjadwalan->online_offline,
                'flag' => $penjadwalan->flag,
                
                // Data dari relasi Event
                'event' => [
                    'id_event' => $penjadwalan->event?->id_event,
                    'nama_event' => $penjadwalan->event?->nama_event,
                    'mulai_event' => $penjadwalan->event?->mulai_event,
                    'akhir_event' => $penjadwalan->event?->akhir_event,
                ],
                

                'paket_ujian' => $penjadwalan->event?->nama_event ?? 'paket tidak ditemukan',
                
                // Data tambahan dari JadwalUjian
                'jadwal_ujian_count' => $penjadwalan->event?->jadwalUjian?->count() ?? 0,
            ];
        });

        return Inertia::render('penjadwalan/penjadwalan-manager', [
            'data' => $data,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        // Ambil data Event dan MBidang untuk dropdown
        $events = Event::where('status', 1)->get(['id_event', 'nama_event']);
        $bidangs = MBidang::all(['kode', 'nama']);

        return Inertia::render('penjadwalan/form.penjadwalan-manager', [
            'events' => $events,
            'bidangs' => $bidangs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_paket_ujian' => 'required|integer|exists:data_db.t_event,id_event',
            'tipe_ujian' => 'required|string|exists:data_db.m_bidang,kode',
            'tanggal' => 'required|date',
            'waktu_mulai' => 'required',
            'waktu_selesai' => 'required|after:waktu_mulai',
            'kuota' => 'required|integer|min:1',
            'jenis_ujian' => 'required|integer',
        ]);

        $penjadwalan = Penjadwalan::create($validated);

        // Load relasi untuk response
        $penjadwalan->load(['event', 'jenis_ujian']);

        return redirect()->route('penjadwalan.index')
            ->with('success', "Jadwal ujian {$penjadwalan->event->nama_event} berhasil ditambahkan.");
    }

    public function show(Penjadwalan $penjadwalan)
    {
        // Load relasi Event dan JadwalUjian melalui Event
        $penjadwalan->load([
            'event.jadwalUjian.peserta.jurusanRef'
        ]);

        return Inertia::render('penjadwalan/detail', [
            'penjadwalan' => [
                'id_penjadwalan' => $penjadwalan->id_penjadwalan,
                'tanggal' => $penjadwalan->tanggal,
                'waktu_mulai' => $penjadwalan->waktu_mulai,
                'waktu_selesai' => $penjadwalan->waktu_selesai,
                'kuota' => $penjadwalan->kuota,
                'status' => $penjadwalan->status,
                
                'event' => $penjadwalan->event,
                
                // Detail peserta dari JadwalUjian melalui Event
                'peserta_list' => $penjadwalan->event?->jadwalUjian?->map(function($jadwal) {
                    return [
                        'id_ujian' => $jadwal->id_ujian,
                        'nama_ujian' => $jadwal->nama_ujian,
                        'kode_kelas' => $jadwal->kode_kelas,
                        'peserta' => [
                            'id' => $jadwal->peserta?->id,
                            'nama' => $jadwal->peserta?->nama,
                            'nis' => $jadwal->peserta?->nis,
                            'jurusan' => $jadwal->peserta?->jurusanRef?->nama_jurusan,
                        ]
                    ];
                }) ?? [],
                
                'statistik' => [
                    'total_jadwal_ujian' => $penjadwalan->event?->jadwalUjian?->count() ?? 0,
                    'total_peserta' => $penjadwalan->event?->jadwalUjian?->count() ?? 0,
                ],
            ]
        ]);
    }

    public function edit(Penjadwalan $penjadwalan)
    {
        // Load relasi yang diperlukan
        $penjadwalan->load(['event', 'jenis_ujian']);
        
        $events = Event::where('status', 1)->get(['id_event', 'nama_event']);
        $bidangs = MBidang::all(['kode', 'nama']);

        return Inertia::render('penjadwalan/form.penjadwalan-manager', [
            'penjadwalan' => $penjadwalan,
            'events' => $events,
            'bidangs' => $bidangs,
        ]);
    }

    public function update(Request $request, Penjadwalan $penjadwalan)
    {
        $validated = $request->validate([
            'id_paket_ujian' => 'required|integer|exists:data_db.t_event,id_event',
            'tipe_ujian' => 'required|string|exists:data_db.m_bidang,kode',
            'tanggal' => 'required|date',
            'waktu_mulai' => 'required',
            'waktu_selesai' => 'required|after:waktu_mulai',
            'kuota' => 'required|integer|min:1',
            'jenis_ujian' => 'required|integer',
        ]);

        $penjadwalan->update($validated);

        // Load relasi untuk response
        $penjadwalan->load(['event', 'jenis_ujian']);

        return redirect()->route('penjadwalan.index')
            ->with('success', "Jadwal ujian {$penjadwalan->event->nama_event} berhasil diperbarui.");
    }

    public function destroy(Penjadwalan $penjadwalan)
    {
        // Load relasi untuk mendapatkan nama event dan cek jadwal ujian
        $penjadwalan->load(['event.jadwalUjian']);
        $namaEvent = $penjadwalan->event->nama_event;

        // Cek apakah ada jadwal ujian dalam event ini
        $jadwalUjianCount = $penjadwalan->event?->jadwalUjian?->count() ?? 0;
        
        if ($jadwalUjianCount > 0) {
            return redirect()->back()
                ->with('error', "Tidak dapat menghapus penjadwalan {$namaEvent} karena masih ada {$jadwalUjianCount} jadwal ujian dalam event ini.");
        }

        $penjadwalan->delete();

        return redirect()->back()
            ->with('success', "Penjadwalan {$namaEvent} berhasil dihapus.");
    }

}
