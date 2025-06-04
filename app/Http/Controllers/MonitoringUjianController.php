<?php

namespace App\Http\Controllers;

use App\Models\Penjadwalan;
use App\Models\JadwalUjian;
use App\Models\JadwalUjianSoal;
use App\Models\Peserta;
use App\Models\Pengerjaan;
use App\Models\PengerjaanJawaban;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

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
    public function show(Request $request, $id)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $page = $request->input('page', 1);

        // Get the penjadwalan data
        $penjadwalan = Penjadwalan::with(['event', 'jenis_ujian'])->findOrFail($id);

        // Transform ujian data to expected format
        $transformedUjian = [
            'id' => $penjadwalan->id_penjadwalan,
            'tipe_ujian' => $penjadwalan->tipe_ujian,
            'paket_ujian' => $penjadwalan->paket_ujian,
            'kelas_prodi' => $penjadwalan->kelas_prodi,
            'tanggal_ujian' => $penjadwalan->tanggal ? $penjadwalan->tanggal->format('Y-m-d') : null,
            'mulai' => $penjadwalan->mulai,
            'selesai' => $penjadwalan->selesai,
            'kuota' => $penjadwalan->kuota,
            'tipe' => $penjadwalan->tipe,
        ];

        // Get JadwalUjian filtered by id_penjadwalan and kode_part matching tipe_ujian
        Log::info('Searching JadwalUjian with:', [
            'id_penjadwalan' => $id,
            'kode_part' => $penjadwalan->tipe_ujian,
        ]);

        // First try with the original query
        $jadwalUjian = JadwalUjian::where('id_penjadwalan', $id)
            ->where('kode_part', $penjadwalan->tipe_ujian)
            ->first();

        // If not found, try without kode_part filter (in case there's a mismatch)
        if (!$jadwalUjian) {
            Log::info('JadwalUjian not found with kode_part filter, trying without it');
            $jadwalUjian = JadwalUjian::where('id_penjadwalan', $id)->first();
        }

        Log::info('JadwalUjian found:', [
            'found' => $jadwalUjian ? true : false,
            'id_ujian' => $jadwalUjian ? $jadwalUjian->id_ujian : null,
            'kode_part' => $jadwalUjian ? $jadwalUjian->kode_part : null,
        ]);

        if (!$jadwalUjian) {
            // Return empty students data if no jadwal ujian found
            $studentsData = [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => $perPage,
                'total' => 0,
            ];

            $stats = [
                'total_students' => 0,
                'active_students' => 0,
                'finished_students' => 0,
            ];

            return Inertia::render('monitoring/detail', [
                'ujian' => $transformedUjian,
                'studentsData' => $studentsData,
                'stats' => $stats,
            ]);
        }

        // Parse kode_kelas to get participant IDs
        $participantIds = [];

        // Debug: Log the jadwal ujian data
        Log::info('JadwalUjian data:', [
            'id_ujian' => $jadwalUjian->id_ujian,
            'kode_kelas' => $jadwalUjian->kode_kelas,
            'kode_kelas_type' => gettype($jadwalUjian->kode_kelas),
            'kode_kelas_length' => strlen($jadwalUjian->kode_kelas ?? ''),
            'kode_kelas_raw' => json_encode($jadwalUjian->kode_kelas),
        ]);

        if ($jadwalUjian->kode_kelas) {
            // Trim whitespace and split by comma
            $kodeKelasClean = trim(strval($jadwalUjian->kode_kelas));
            if (!empty($kodeKelasClean)) {
                // Split by comma and clean each value
                $rawIds = explode(',', $kodeKelasClean);
                $participantIds = [];

                foreach ($rawIds as $rawId) {
                    $cleanId = trim($rawId);
                    if (!empty($cleanId) && is_numeric($cleanId)) {
                        $participantIds[] = intval($cleanId);
                    }
                }

                // Remove duplicates and sort
                $participantIds = array_unique($participantIds);
                sort($participantIds);
            }
        }

        // Debug: Log the parsed participant IDs
        Log::info('Parsed participant IDs:', [
            'participantIds' => $participantIds,
            'count' => count($participantIds),
        ]);

        // Get total questions from JadwalUjianSoal
        $jadwalUjianSoal = JadwalUjianSoal::where('id_ujian', $jadwalUjian->id_ujian)->first();
        $totalQuestions = $jadwalUjianSoal ? $jadwalUjianSoal->total_soal : 0;

        // Query participants who exist in Pengerjaan and match the specific ujian
        $pengerjaanQuery = Pengerjaan::with(['peserta'])
            ->whereIn('id_peserta', $participantIds)
            ->where('id_ujian', $jadwalUjian->id_ujian)
            ->when($search, function ($query, $search) {
                return $query->whereHas('peserta', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%");
                });
            });

        $pengerjaanList = $pengerjaanQuery->paginate($perPage);

        // Transform data for students table
        $studentsData = $pengerjaanList->toArray();
        $studentsData['data'] = collect($pengerjaanList->items())->map(function ($pengerjaan) use ($totalQuestions) {
            // Count completed questions from PengerjaanJawaban
            $completedQuestions = PengerjaanJawaban::where('id_pengerjaan', $pengerjaan->id_pengerjaan)->count();

            // Determine status based on nilai (score)
            $status = 'active';
            if ($pengerjaan->nilai !== null && $pengerjaan->nilai > 0) {
                $status = 'finish';
            }

            return [
                'id' => $pengerjaan->id_peserta,
                'name' => $pengerjaan->peserta ? $pengerjaan->peserta->nama : 'Unknown',
                'completedQuestions' => $completedQuestions,
                'totalQuestions' => $totalQuestions,
                'status' => $status,
                'nilai' => $pengerjaan->nilai,
            ];
        })->toArray();

        // Calculate statistics
        $totalParticipants = count($participantIds);

        // Debug: Log statistics calculation
        Log::info('Statistics calculation:', [
            'participantIds' => $participantIds,
            'totalParticipants' => $totalParticipants,
        ]);

        $participantsInPengerjaan = 0;
        $finishedParticipants = 0;

        if (!empty($participantIds)) {
            $participantsInPengerjaan = Pengerjaan::whereIn('id_peserta', $participantIds)
                ->where('id_ujian', $jadwalUjian->id_ujian)
                ->count();
            $finishedParticipants = Pengerjaan::whereIn('id_peserta', $participantIds)
                ->where('id_ujian', $jadwalUjian->id_ujian)
                ->where(function ($query) {
                    $query->whereNotNull('nilai')->where('nilai', '>', 0);
                })->count();
        }

        $activeParticipants = $participantsInPengerjaan - $finishedParticipants;

        Log::info('Final statistics:', [
            'participantsInPengerjaan' => $participantsInPengerjaan,
            'finishedParticipants' => $finishedParticipants,
            'activeParticipants' => $activeParticipants,
        ]);

        $stats = [
            'total_students' => $totalParticipants,
            'active_students' => $activeParticipants,
            'finished_students' => $finishedParticipants,
            'participantIds' => $participantIds,
        ];

        return Inertia::render('monitoring/detail', [
            'ujian' => $transformedUjian,
            'studentsData' => $studentsData,
            'stats' => $stats,
            'debug' => [
                'participantIds' => $participantIds,
                'jadwalUjianSoal' => $jadwalUjianSoal,
                'totalQuestions' => $totalQuestions,
                'pengerjaanList' => $pengerjaanList->toArray(),
                'finished_students' => $finishedParticipants,
                'jadwalUjian' => [
                    'id_ujian' => $jadwalUjian ? $jadwalUjian->id_ujian : null,
                    'kode_kelas' => $jadwalUjian ? $jadwalUjian->kode_kelas : null,
                    'kode_part' => $jadwalUjian ? $jadwalUjian->kode_part : null,
                ],
                'penjadwalan' => [
                    'id_penjadwalan' => $penjadwalan->id_penjadwalan,
                    'tipe_ujian' => $penjadwalan->tipe_ujian,
                ],
            ],
        ]);
    }
}
