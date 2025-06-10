<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Peserta;

class PesertaManagerController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->query('search');
        $pages = $request->query('pages', 10);

        // Ambil parameter sorting dari query string, default: sort by 'nama' ascending
        $sort = $request->query('sort', 'id');
        $direction = 'asc';

        $pesertaQuery = Peserta::with('jurusanRef');

        if ($search) {
            $pesertaQuery->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%$search%")
                    ->orWhere('nis', 'like', "%$search%")
                    ->orWhere('username', 'like', "%$search%");
            });
        }

        // Validasi kolom yang boleh di-sort untuk keamanan
        $allowedSorts = ['id', 'nama', 'nis', 'username'];
        if (in_array($sort, $allowedSorts)) {
            $pesertaQuery->orderBy($sort, $direction);
        } else {
            $pesertaQuery->orderBy('id', 'asc');
        }

        return Inertia::render(
            'master-data/peserta-manager',
            [
                'data' => $pesertaQuery->paginate((int)$pages)->withQueryString(),
                'filters' => [
                    'search' => $search,
                    'pages' => $pages,
                    'sort' => $sort,
                    // 'direction' tidak perlu karena selalu ASC
                ],
            ]
        );
    }

    public function delete(Request $request, Peserta $peserta)
    {
        $peserta->delete();

        return redirect()->back()->with('success', 'Data berhasil dihapus');
    }

    public function update(Request $request, Peserta $peserta)
    {

        $data = $request->validate([
            'username' => 'required|string|max:255',
            'status' => 'integer',
            'jurusan' => 'required|integer',
            'nis' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
        ]);

        $peserta->update($data);

        return redirect()->back()->with('success', 'Data berhasil diupdate');
    }
}
