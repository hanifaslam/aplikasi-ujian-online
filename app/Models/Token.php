<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class Token extends Model
{
    protected $connection = 'data_db';
    protected $table = 't_status';
    protected $primaryKey = 'id_status';
    public $timestamps = false;

    protected $fillable = [
        'keterangan_status',
        'status',
        'waktu',
        'apa_ini',
    ];

    protected $casts = [
        'waktu' => 'datetime',
        'status' => 'integer',
    ];

    /**
     * Generate token acak dengan kombinasi huruf kapital dan angka
     */
    public static function generateRandomToken($length = 6)
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $token = '';

        for ($i = 0; $i < $length; $i++) {
            $token .= $characters[rand(0, strlen($characters) - 1)];
        }

        return $token;
    }

    /**
     * Update token langsung di database pada record id_status = 2
     */
    public static function updateFirstRowToken()
    {
        try {
            \Log::info('=== MULAI UPDATE TOKEN DI MODEL ===');

            // Cek koneksi database
            $connection = DB::connection('data_db');
            \Log::info('Menggunakan koneksi:', ['connection' => 'data_db']);

            // Cek apakah record ada
            $existingRecord = $connection->table('t_status')->where('id_status', 2)->first();
            \Log::info('Record yang ditemukan:', ['record' => $existingRecord ? (array)$existingRecord : null]);

            if (!$existingRecord) {
                \Log::error('Record dengan id_status = 2 tidak ditemukan');
                return null;
            }

            // Generate token baru
            $newToken = self::generateRandomToken(6);
            \Log::info('Token baru yang dibuat:', ['new_token' => $newToken]);

            // Update langsung menggunakan DB query builder
            $affected = $connection->table('t_status')
                ->where('id_status', 2)
                ->update([
                    'keterangan_status' => $newToken,
                    'waktu' => now(),
                    'status' => 1
                ]);

            \Log::info('Update result:', [
                'affected_rows' => $affected,
                'new_token' => $newToken
            ]);

            if ($affected > 0) {
                // Ambil record yang sudah diupdate untuk dikembalikan
                $updatedRecord = self::where('id_status', 2)->first();
                \Log::info('Record setelah update:', ['updated_record' => $updatedRecord ? $updatedRecord->toArray() : null]);

                return $updatedRecord;
            }

            \Log::error('Tidak ada baris yang terpengaruh dalam update');
            return null;
        } catch (\Exception $e) {
            \Log::error('Error dalam updateFirstRowToken:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    /**
     * Get current active token
     */
    public static function getCurrentToken()
    {
        return self::where('id_status', 2)->first();
    }
}
