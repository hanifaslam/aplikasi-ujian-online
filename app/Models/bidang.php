<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bidang extends Model
{
    protected $connection = 'data_db';
    protected $table = 'm_bidang';
    public $timestamps = false;

    protected $primaryKey = 'kode';

    protected $fillable = [
        'nama',
        'type',
    ];

    // public function paket_soal()
    // {
    //     return $this->hasOne(PaketSoal::class, 'kode_bidang', 'kode');
    // }

    public function jadwal_ujian_soal(){
        return $this->hasMany(JadwalUjianSoal::class, 'kd_bidang', 'kode');
    }

    public function event()
    {
        return $this->hasMany(Event::class, 'nama_event', 'kode');
    }
}
