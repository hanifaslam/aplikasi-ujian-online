<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JadwalUjian extends Model
{
    protected $connection = 'data_db';
    protected $table = 't_jadwal_ujian';

    protected $primaryKey = 'id_ujian';

    public $timestamps = false;

    protected $fillable = [
        'nama_ujian',
        'kode_kelas',
        'id_event',
        'kode_part',
        'id_penjadwalan'
    ];

    protected $casts = [
        'nama_ujian' => 'string',
        'kode_kelas' => 'string',
        'id_event' => 'integer',
        'kode_part' => 'integer',
        'id_penjadwalan' => 'integer',
    ];
}
