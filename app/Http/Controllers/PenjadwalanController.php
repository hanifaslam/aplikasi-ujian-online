<?php

namespace App\Http\Controllers;

use App\Models\Penjadwalan;
use App\Models\Event;
use App\Models\KategoriSoal;
use App\Models\JadwalUjian;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PenjadwalanController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $query = Penjadwalan::with([
            'event',           // Relasi ke Event untuk mendapatkan nama_event
            'event.jadwalUjian',
            'jenis_ujian'      // Relasi ke KategoriSoal untuk nama kategori
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
                'tipe_ujian' => $penjadwalan->tipe_ujian, // Akan menggunakan accessor dari model
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
        // Ambil data Event dan KategoriSoal
        $events = Event::where('status', 1)->get(['id_event', 'nama_event']);
        $kategoriSoal = KategoriSoal::all(['id', 'kategori']);

        return Inertia::render('penjadwalan/form.penjadwalan-manager', [
            'events' => $events,
            'kategoriSoal' => $kategoriSoal,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_paket_ujian' => 'required|integer|exists:data_db.t_event,id_event',
            'tipe_ujian' => 'required|integer|exists:data_db.t_kat_soal,id',
            'tanggal' => 'required|date',
            'waktu_mulai' => 'required',
            'waktu_selesai' => 'required|after:waktu_mulai',
            'kuota' => 'required|integer|min:1',
            'jenis_ujian' => 'required|integer',
        ]);

        return DB::transaction(function () use ($validated) {
            // Ambil data kategori dan event sebelum create
            $kategoriSoal = KategoriSoal::find($validated['tipe_ujian']);
            $event = Event::find($validated['id_paket_ujian']);
            
            // Generate kode jadwal
            $kodeJadwal = $this->generateKodeJadwal($validated['id_paket_ujian'], $validated['tipe_ujian']);
            
            // Tambahkan kode jadwal ke data yang akan disimpan
            $validated['kode_jadwal'] = $kodeJadwal;

            // Buat Penjadwalan
            $penjadwalan = Penjadwalan::create($validated);

            // Buat JadwalUjian otomatis
            $this->createJadwalUjian($penjadwalan);

            // Prepare nama untuk success message
            $kategoriNama = $kategoriSoal ? $kategoriSoal->kategori : 'Kategori Ujian';
            $namaEvent = $event ? $event->nama_event : 'Event';

            return redirect()->route('penjadwalan.index')
                ->with('success', "Jadwal ujian {$kategoriNama} - {$namaEvent} dengan kode {$kodeJadwal} berhasil ditambahkan.");
        });
    }

    public function edit(Penjadwalan $penjadwalan)
    {
        // Load relasi yang diperlukan
        $penjadwalan->load(['event']);
        
        $events = Event::where('status', 1)->get(['id_event', 'nama_event']);
        $kategoriSoal = KategoriSoal::all(['id', 'kategori']);

        return Inertia::render('penjadwalan/form.penjadwalan-manager', [
            'penjadwalan' => $penjadwalan,
            'events' => $events,
            'kategoriSoal' => $kategoriSoal,
        ]);
    }

    public function update(Request $request, Penjadwalan $penjadwalan)
    {
        $validated = $request->validate([
            'id_paket_ujian' => 'required|integer|exists:data_db.t_event,id_event',
            'tipe_ujian' => 'required|integer|exists:data_db.t_kat_soal,id',
            'tanggal' => 'required|date',
            'waktu_mulai' => 'required',
            'waktu_selesai' => 'required|after:waktu_mulai',
            'kuota' => 'required|integer|min:1',
            'jenis_ujian' => 'required|integer',
        ]);

        return DB::transaction(function () use ($validated, $penjadwalan) {
            // Jika event atau kategori berubah, generate ulang kode jadwal
            if ($penjadwalan->id_paket_ujian != $validated['id_paket_ujian'] || 
                $penjadwalan->tipe_ujian != $validated['tipe_ujian']) {
                $validated['kode_jadwal'] = $this->generateKodeJadwal($validated['id_paket_ujian'], $validated['tipe_ujian']);
            }

            $penjadwalan->update($validated);

            // Ambil data kategori dan event untuk success message
            $kategoriSoal = KategoriSoal::find($validated['tipe_ujian']);
            $event = Event::find($validated['id_paket_ujian']);

            $kategoriNama = $kategoriSoal ? $kategoriSoal->kategori : 'Kategori Ujian';
            $namaEvent = $event ? $event->nama_event : 'Event';

            return redirect()->route('penjadwalan.index')
                ->with('success', "Jadwal ujian {$kategoriNama} - {$namaEvent} berhasil diperbarui.");
        });
    }

    public function destroy(Penjadwalan $penjadwalan)
    {
        return DB::transaction(function () use ($penjadwalan) {
            // Load relasi untuk mendapatkan nama event
            $penjadwalan->load(['event']);
            $namaEvent = $penjadwalan->event->nama_event;

            // Hapus JadwalUjian yang terkait dengan penjadwalan ini
            JadwalUjian::where('id_penjadwalan', $penjadwalan->id_penjadwalan)->delete();

            // Hapus penjadwalan
            $penjadwalan->delete();

            return redirect()->back()
                ->with('success', "Penjadwalan {$namaEvent} dan jadwal ujian terkait berhasil dihapus.");
        });
    }

    /**
     * Generate kode jadwal seperti format TFL0002
     */
    private function generateKodeJadwal($idEvent, $idKategori)
    {
        // Ambil event dan kategori
        $event = Event::find($idEvent);
        $kategori = KategoriSoal::find($idKategori);

        if (!$event || !$kategori) {
            return 'UJI0001';
        }

        // Ambil 3 huruf pertama dari kombinasi event dan kategori
        $eventCode = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $event->nama_event), 0, 2));
        $kategoriCode = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $kategori->kategori), 0, 1));
        
        // Kombinasi 3 huruf
        $prefix = $eventCode . $kategoriCode;
        
        // Jika kurang dari 3 huruf, tambahkan 'X'
        $prefix = str_pad($prefix, 3, 'X');
        
        // Jika lebih dari 3 huruf, potong menjadi 3
        $prefix = substr($prefix, 0, 3);

        // Cari nomor urut terakhir untuk prefix ini
        $lastKode = Penjadwalan::where('kode_jadwal', 'LIKE', $prefix . '%')
            ->orderBy('kode_jadwal', 'desc')
            ->first();

        if ($lastKode) {
            // Ambil 4 digit terakhir dan tambah 1
            $lastNumber = (int) substr($lastKode->kode_jadwal, -4);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        // Format 4 digit dengan leading zero
        $number = str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        // Gabungkan prefix + number (format: ABC0001)
        return $prefix . $number;
    }

    /**
     * Buat JadwalUjian otomatis saat Penjadwalan dibuat
     */
    private function createJadwalUjian($penjadwalan)
    {
        // Load relasi event dan ambil kategori manual
        $penjadwalan->load(['event']);
        $kategoriSoal = KategoriSoal::find($penjadwalan->tipe_ujian);

        // Ambil nama kategori saja (bagian sebelum tanda "-")
        $kategoriNama = $kategoriSoal ? $kategoriSoal->kategori : 'Kategori Tidak Diketahui';
        
        // Jika kategori mengandung tanda "-", ambil bagian sebelumnya saja
        if (strpos($kategoriNama, '-') !== false) {
            $kategoriNama = trim(explode('-', $kategoriNama)[0]);
        }

        // Buat JadwalUjian dengan nama ujian = tipe ujian saja
        JadwalUjian::create([
            'nama_ujian' => $kategoriNama,
            'kode_kelas' => null, // Set sebagai NaN sesuai permintaan
            'id_event' => $penjadwalan->id_paket_ujian,
            'kode_part' => 1, // Default atau ambil dari logic tertentu
            'id_penjadwalan' => $penjadwalan->id_penjadwalan,
        ]);
    }
}
