<?php

use App\Http\Controllers\MatkulController;
use App\Http\Controllers\UserManagerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Matakuliah;

// Custom route binding untuk Matakuliah model
Route::bind('matakuliah', function ($value) {
    return Matakuliah::where('id_mk', $value)->firstOrFail();
});

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // yang perlu diinget, buat name yang punya nama lebih dari 1 kata, contohnya monitoring-ujian
    // itu harus diubah jadi pake titik, contoh monitoring.ujian
    // jadi nanti di route name-nya jadi monitoring.ujian

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('jadwal-ujian', function () {
        return Inertia::render('peserta');
    })->name('peserta');

    Route::get('monitoring-ujian', function () {
        return Inertia::render('peserta');
    })->name('monitoring.ujian');

    Route::get('rekap-nilai', function () {
        return Inertia::render('peserta');
    })->name('peserta');

    // Buat route yang punya submenu, bisa dimasukkan ke dalam group
    // contohnya kek gini buat master-data
    Route::prefix('master-data')->name('master-data.')->group(function () {
        Route::get('/', function () {
            return redirect()->route('dashboard');
        })->name('index');

        Route::get('peserta', function () {
            return Inertia::render('peserta');
        })->name('peserta');

        Route::get('dosen', function () {
            return Inertia::render('peserta');
        })->name('peserta');

        Route::get('kategori-ujian', function () {
            return Inertia::render('peserta');
        })->name('peserta');

        Route::get('jenis-ujian', function () {
            return Inertia::render('peserta');
        })->name('peserta');

        Route::get('jenisujian', [JenisUjianController::class, 'index']);

        Route::get('paket-soal', function () {
            return Inertia::render('peserta');
        })->name('peserta');

        // Route show bank soal
        Route::get('bank-soal', [BankSoalController::class, 'index'])->name('bank.soal');

        // Route hapus bank soal
        Route::delete('bank-soal/{id}', [BankSoalController::class, 'destroy'])->name('bank.soal.destroy');

        // Route edit bank soal
        Route::put('bank-soal/update/{id}', [BankSoalController::class, 'update'])->name('bank.soal.update');
        Route::get('bank-soal/{id}/edit', [BankSoalController::class, 'edit'])->name('bank.soal.edit');

        // Route tambah bank soal
        Route::get('bank-soal/create', function () {
            return Inertia::render('banksoalcreate');
        })->name('bank.soal.create');
        
        Route::post('bank-soal', [BankSoalController::class, 'store'])->name('bank.soal.store');
                
        // Route untuk matakuliah dipindahkan ke dalam grup master-data
        Route::prefix('matakuliah')->name('matakuliah.')->group(function () {
            Route::get('/', [MatkulController::class, 'index'])->name('index');
            Route::get('/create', [MatkulController::class, 'create'])->name('create');
            Route::post('/', [MatkulController::class, 'store'])->name('store');
            Route::get('/{matakuliah}/edit', [MatkulController::class, 'edit'])->name('edit');
            Route::put('/{matakuliah}', [MatkulController::class, 'update'])->name('update');
            Route::delete('/{matakuliah}', [MatkulController::class, 'destroy'])->name('destroy');
        });
    });

    Route::middleware(['role:super_admin'])->group(function () {
        Route::prefix('user-management')->name('user-management.')->group(function () {
            Route::get('/', function () {
                return redirect()->route('dashboard');
            })->name('index');

            Route::prefix('user')->name('user.')->group(function () {
                Route::get('/', [UserManagerController::class, 'index'])->name('manager');
                Route::get('{id}/edit', [UserManagerEditController::class, 'edit'])->name('edit');
                Route::put('{id}', [UserManagerEditController::class, 'update'])->name('update');
                Route::delete('{user}', [UserManagerController::class, 'delete'])->name('destroy');
                Route::get('create', [UserManagerEditController::class, 'create'])->name('create');
                Route::post('/', [UserManagerEditController::class, 'store'])->name('store');
            });

            Route::get('roles', function () {
                return Inertia::render('user-management/role-manager');
            })->name('roles');
        });
    });
});

// // Tambahkan route untuk Peserta
// Route::prefix('peserta')->name('peserta.')->group(function () {
//     // Daftar peserta
//     Route::get('/', [PesertaController::class, 'index'])->name('index');

//     // Menambah peserta
//     Route::get('create', [PesertaController::class, 'create'])->name('create');
//     Route::post('/', [PesertaController::class, 'store'])->name('store');

//     // Mengedit peserta
//     Route::get('{peserta}/edit', [PesertaController::class, 'edit'])->name('edit');
//     Route::put('{peserta}', [PesertaController::class, 'update'])->name('update');

//     // Menghapus peserta
//     Route::delete('{peserta}', [PesertaController::class, 'destroy'])->name('destroy');
// });

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
