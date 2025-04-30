<?php

namespace App\Http\Controllers;

use App\Models\Peserta;
use App\Http\Requests\StorePesertaRequest;
use App\Http\Requests\UpdatePesertaRequest;
use Inertia\Inertia;

class PesertaController extends Controller
{
    // Menampilkan daftar peserta
    public function index()
    {
        $peserta = Peserta::paginate(10);  // Atau sesuaikan dengan kebutuhan pagination
        return Inertia::render('Peserta/Index', [
            'peserta' => $peserta
        ]);
    }

    // Menampilkan form untuk menambah peserta
    public function create()
    {
        return Inertia::render('Peserta/Create');
    }

    // Menyimpan data peserta baru
    public function store(StorePesertaRequest $request)
    {
        // Validasi sudah otomatis dijalankan oleh StorePesertaRequest
        Peserta::create($request->validated());

        // Redirect ke halaman daftar peserta dengan pesan sukses
        return redirect()->route('peserta.index')->with('success', 'Peserta berhasil ditambahkan');
    }

    // Menampilkan form untuk mengedit peserta
    public function edit(Peserta $peserta)
    {
        return Inertia::render('Peserta/Edit', [
            'peserta' => $peserta
        ]);
    }

    // Memperbarui data peserta
    public function update(UpdatePesertaRequest $request, Peserta $peserta)
    {
        // Validasi sudah otomatis dijalankan oleh UpdatePesertaRequest
        $peserta->update($request->validated());

        // Redirect ke halaman daftar peserta dengan pesan sukses
        return redirect()->route('peserta.index')->with('success', 'Peserta berhasil diperbarui');
    }

    // Menghapus peserta
    public function destroy(Peserta $peserta)
    {
        $peserta->delete();

        return redirect()->route('peserta.index')->with('success', 'Peserta berhasil dihapus');
    }
}
