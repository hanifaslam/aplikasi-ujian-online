<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePesertaRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna diizinkan untuk membuat request ini.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Pastikan user diizinkan untuk membuat peserta
    }

    /**
     * Dapatkan aturan validasi yang harus diterapkan pada request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'nama' => 'required|string|max:255',
            'nis' => 'required|numeric|unique:t_peserta,nis',  // Unique NIS pada tabel t_peserta
            'jurusan' => 'required|integer|exists:jurusans,id', // Pastikan jurusan ada di tabel jurusans
            'status' => 'required|integer|in:0,1', // Status bisa 0 atau 1
            'aktif' => 'required|boolean',
        ];
    }
}
