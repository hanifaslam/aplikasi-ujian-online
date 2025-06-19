<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Matakuliah;
use App\Http\Controllers\{
    BankSoalController,
    KategoriUjianController,
    MatkulController,
    TestController,
    UserManagerController,
    UserManagerEditController,
    PesertaManagerController,
    PesertaManagerEditController,
    PesertaImportController,
    JenisUjianEditController,
    JenisUjianController,
    PenjadwalanController,
    MonitoringUjianController,
    EventController,
    BankSoalControllerCheckbox,
    PaketSoalController,
    PaketSoalEditController,
    DosenManagerController,
    DosenManagerEditController,
    DosenImportController,
    TokenController
};

// Custom binding
Route::bind('matakuliah', fn($value) => Matakuliah::where('id_mk', $value)->firstOrFail());

// Login
Route::get('/', fn () => Inertia::render('auth/login'))->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');

    // Monitoring
    Route::get('monitoring-ujian', [MonitoringUjianController::class, 'index'])->name('monitoring.ujian');
    Route::get('monitoring-ujian/{id}', [MonitoringUjianController::class, 'show'])->name('monitoring.ujian.detail');

    // Penjadwalan
    Route::prefix('penjadwalan')->name('penjadwalan.')->group(function () {
        Route::get('/', [PenjadwalanController::class, 'index'])->name('index');
        Route::get('/create', [PenjadwalanController::class, 'create'])->name('create');
        Route::post('/', [PenjadwalanController::class, 'store'])->name('store');
        Route::get('/{penjadwalan}/edit', [PenjadwalanController::class, 'edit'])->name('edit');
        Route::put('/{penjadwalan}', [PenjadwalanController::class, 'update'])->name('update');
        Route::delete('/{penjadwalan}', [PenjadwalanController::class, 'destroy'])->name('destroy');
    });

    // Rekap Nilai
    Route::get('rekap-nilai', [App\Http\Controllers\RekapNilaiController::class, 'index'])->name('rekap.nilai');
    Route::get('rekap-nilai/{id}', [App\Http\Controllers\RekapNilaiController::class, 'show'])->name('rekap.nilai.detail');
    Route::get('rekap-nilai/{id}/export', [App\Http\Controllers\RekapNilaiController::class, 'export'])->name('rekap.nilai.export');

    // MASTER DATA
    Route::prefix('master-data')->name('master-data.')->group(function () {
        Route::get('/', fn () => redirect()->route('dashboard'))->name('index');

        Route::get('peserta', fn () => Inertia::render('peserta'))->name('peserta');
        Route::get('dosen', fn () => Inertia::render('dosen'))->name('dosen');
        Route::get('kategori-ujian', fn () => Inertia::render('kategori-ujian'))->name('kategori.ujian');
        Route::get('soal', fn () => Inertia::render('soal'))->name('soal');
        Route::get('jenisujian', [JenisUjianController::class, 'index']);

        Route::resource('matakuliah', MatkulController::class)->parameters(['matakuliah' => 'matakuliah'])->names('matakuliah');

        Route::prefix('dosen')->name('dosen.')->group(function () {
            Route::get('/', [DosenManagerController::class, 'index'])->name('manager');
            Route::get('{id}/edit', [DosenManagerEditController::class, 'edit'])->name('edit');
            Route::put('{id}', [DosenManagerEditController::class, 'update'])->name('update');
            Route::delete('{user}', [DosenManagerController::class, 'delete'])->name('destroy');
            Route::get('create', [DosenManagerEditController::class, 'create'])->name('create');
            Route::post('/', [DosenManagerEditController::class, 'store'])->name('store');
            Route::post('import', [DosenImportController::class, 'import'])->name('import');
        });

        Route::get('import-dosen', [DosenImportController::class, 'importViewDosen'])->name('import-dosen.view');

        Route::prefix('peserta')->name('peserta.')->group(function () {
            Route::get('/', [PesertaManagerController::class, 'index'])->name('manager');
            Route::get('{id}/edit', [PesertaManagerEditController::class, 'edit'])->name('edit');
            Route::put('{id}', [PesertaManagerEditController::class, 'update'])->name('update');
            Route::delete('{peserta}', [PesertaManagerController::class, 'delete'])->name('destroy');
            Route::get('create', [PesertaManagerEditController::class, 'create'])->name('create');
            Route::post('/', [PesertaManagerEditController::class, 'store'])->name('store');
            Route::post('import', [PesertaImportController::class, 'import'])->name('import');
        });

        Route::prefix('import')->name('import.')->group(function () {
            Route::get('/', [PesertaImportController::class, 'importView'])->name('view');
        });

        Route::resource('bank-soal', BankSoalController::class)->except(['show'])->names('bank.soal');
        Route::get('bank-soal/create', fn () => Inertia::render('banksoalcreate'))->name('bank.soal.create');

        Route::prefix('bank-soal-checkbox')->name('bank-soal-checkbox.')->group(function () {
            Route::get('/', [BankSoalControllerCheckbox::class, 'index'])->name('index');
            Route::get('/{paket_soal}/edit', [BankSoalControllerCheckbox::class, 'edit'])->name('edit');
            Route::put('/{paket_soal}', [BankSoalControllerCheckbox::class, 'update'])->name('update');
        });

        Route::resource('jenis-ujian', JenisUjianController::class)->except(['show'])->names('jenis-ujian');
        Route::get('jenis-ujian/{id}/edit', [JenisUjianEditController::class, 'edit'])->name('jenis-ujian.edit');

        Route::prefix('paket-soal')->name('paket-soal.')->group(function () {
            Route::get('/', fn () => Inertia::render('master-data/paket-soal/paket-soal-manager'))->name('manager');
            Route::get('/create', [PaketSoalEditController::class, 'create'])->name('create');
            Route::get('/create-paket-soal', fn () => Inertia::render('master-data/paket-soal/create-paket-soal'))->name('create-paket-soal');
            Route::get('/create-event', fn () => Inertia::render('master-data/paket-soal/create-event'))->name('create-event');
            Route::post('/', [PaketSoalEditController::class, 'store'])->name('store');
            Route::get('/{paket_soal}/edit', [PaketSoalEditController::class, 'edit'])->name('edit');
            Route::put('/{paket_soal}', [PaketSoalEditController::class, 'update'])->name('update');
            Route::delete('/{paket_soal}', [PaketSoalController::class, 'delete'])->name('destroy');
            Route::post('/store', [PaketSoalEditController::class, 'store_data'])->name('store_data');
        });

        Route::prefix('event')->name('event.')->group(function () {
            Route::get('/', fn () => Inertia::render('master-data/event/EventManager'))->name('manager');
        });

        Route::get('/kategorisoal', [BankSoalController::class, 'getKategoriSoal']);
    });

    Route::middleware(['role:super_admin'])->prefix('user-management')->name('user-management.')->group(function () {
        Route::get('/', fn () => redirect()->route('dashboard'))->name('index');

        Route::prefix('user')->name('user.')->group(function () {
            Route::get('/', [UserManagerController::class, 'index'])->name('manager');
            Route::get('{id}/edit', [UserManagerEditController::class, 'edit'])->name('edit');
            Route::put('{id}', [UserManagerEditController::class, 'update'])->name('update');
            Route::delete('{user}', [UserManagerController::class, 'delete'])->name('destroy');
            Route::get('create', [UserManagerEditController::class, 'create'])->name('create');
            Route::post('/', [UserManagerEditController::class, 'store'])->name('store');
        });

        Route::get('roles', fn () => Inertia::render('user-management/role-manager'))->name('roles');
    });

    Route::get('/token/current', [TokenController::class, 'getCurrentToken'])->name('token.current');
    Route::get('/token/generate', [TokenController::class, 'generateNewToken'])->name('token.generate');
    Route::get('/token/copy', [TokenController::class, 'copyToken'])->name('token.copy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
