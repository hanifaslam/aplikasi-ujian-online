<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peserta extends Model
{
    use HasFactory;

    // Kalau nama tabel kamu bukan 'users', kamu bisa aktifkan ini:
    protected $table = 't_peserta';

    // Kalau tidak pakai timestamps (created_at, updated_at)
    public $timestamps = false;

    protected $fillable = [
        'username',
        'password',
        'status',
        'jurusan',
        'nis',
        'nama',
        'aktif',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'status' => 'integer',
        'jurusan' => 'integer',
        'aktif' => 'boolean',
    ];

    // Scope query untuk user aktif
    public function scopeAktif($query)
    {
        return $query->where('aktif', true);
    }

    // Mutator: hash password setiap diisi/update
    protected static function booted()
    {
        static::creating(function ($user) {
            $user->password = bcrypt($user->password);
        });

        static::updating(function ($user) {
            if ($user->isDirty('password')) {
                $user->password = bcrypt($user->password);
            }
        });
    }

    // Contoh relasi jika jurusan adalah tabel lain
    // public function jurusanRelasi()
    // {
    //     return $this->belongsTo(Jurusan::class, 'jurusan', 'id');
    // }
}
