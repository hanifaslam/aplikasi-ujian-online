<?php

namespace App\Http\Controllers\PaketSoal;

use App\Http\Controllers\Controller;
use App\Models\Bidang;
use Illuminate\Http\Request;
use App\Models\Event;
use Inertia\Inertia;

class MakeEventController extends Controller
{
    public function index()
    {
        $event = Event::get();
        return response()->json($event);
    }

    public function create()
    {
        return Inertia::render('master-data/paket-soal/create-event', [
            'event' => null,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_event' => 'required|string|max:255',
            'status' => 'required|boolean',
            'event_mulai' => 'nullable|date',
            'event_akhir' => 'nullable|date',
        ]);

        $event_mulai = now();
        $event_akhir = now()->addYears(5);

        $event = Event::create([
            'nama_event' => $request->input('nama_event'),
            'status' => $request->input('status', 1),
            'mulai_event' => $request->input('event_mulai', $event_mulai),
            'akhir_event' => $request->input('event_akhir', $event_akhir),
        ]);

       
    }

    public function show($id)
    {
        // Logic to display a specific event
    }

    public function edit($id)
    {
        // Logic to show the form for editing an existing event
    }

    public function update(Request $request, $id)
    {
        // Logic to update an existing event
    }

    public function destroy($id)
    {
        // Logic to delete an existing event
    }

    public function list()
    {
        // Ambil semua event, bisa tambahkan where jika ingin filter tertentu
        $events = Event::select('id_event', 'nama_event')->get();
        return response()->json($events);
    }

    public function getEvent(){
        $events = Event::select('id_event', 'nama_event', 'status')->get();
        return Inertia::render('master-data/event/EventManager', [
            'events' => $events,
        ]);
    }
}
