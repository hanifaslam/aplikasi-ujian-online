<?php

namespace App\Exports;

use App\Models\Pengerjaan;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class NilaiExport implements FromCollection, WithHeadings, WithMapping
{
    protected $jadwalId;
    protected $rowNumber = 1; // untuk auto increment kolom No

    public function __construct($jadwalId)
    {
        $this->jadwalId = $jadwalId;
    }

    public function collection()
    {
        return Pengerjaan::with(['peserta', 'jawaban'])
            ->where('id_jadwal', $this->jadwalId)
            ->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Name',
            'Jumlah Soal',
            'Soal Benar',
            'Soal Salah',
            'Score'
        ];
    }

    public function map($item): array
{
    $total_soal = $item->total_soal ?? 0;
    $soal_benar = $item->jawaban_benar ?? 0;
    $soal_salah = $total_soal - $soal_benar;
    $score = $item->nilai ?? 0;

    return [
        (string) $this->rowNumber++, // tetap tampil
        $item->peserta ? $item->peserta->nama : 'Peserta tidak ditemukan',
        (string) $total_soal,
        (string) $soal_benar,
        (string) $soal_salah,
        (string) round($score)
    ];
}

}
