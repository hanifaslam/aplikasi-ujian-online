<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePesertaRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna diizinkan untuk membuat request ini.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Pastikan user diizinkan untuk memperbarui peserta
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
            'nis' => 'required|numeric|unique:t_peserta,nis,' . $this->route('peserta'),  // Unique kecuali untuk peserta yang sedang diedit
            'jurusan' => 'required|integer|exists:jurusans,id', // Pastikan jurusan ada di tabel jurusans
            'status' => 'required|integer|in:0,1', // Status bisa 0 atau 1
            'aktif' => 'required|boolean',
        ];
    }
}
