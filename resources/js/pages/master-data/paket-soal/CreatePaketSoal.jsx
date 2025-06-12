import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';

export default function CreatePaketSoal() {
  const [bidangs, setBidangs] = useState([]);

  const { data, setData, post, processing, errors, reset } = useForm({
    nama_event: '',
    bidang: '',
    kode_kelas: '',
    soal: ['']
  });

  useEffect(() => {
    axios.get('/api/bidangs').then((res) => {
      setBidangs(res.data);
    });
  }, []);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === 'soal') {
      const updatedSoal = [...data.soal];
      updatedSoal[index] = value;
      setData('soal', updatedSoal);
    } else {
      setData(name, value);
    }
  };

  const addSoal = () => {
    setData('soal', [...data.soal, '']);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('paket-soal.store'), {
      onSuccess: () => {
        alert('Paket soal berhasil dibuat');
        reset();
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Buat Paket Soal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="nama_event"
            value={data.nama_event}
            onChange={handleChange}
            placeholder="Nama Event"
            className="w-full border p-2 rounded"
          />
          {errors.nama_event && <p className="text-red-500 text-sm">{errors.nama_event}</p>}
        </div>

        <div>
          <select
            name="bidang"
            value={data.bidang}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Pilih Bidang</option>
            {bidangs.map((b) => (
              <option key={b.kode} value={b.kode}>
                {b.nama_bidang}
              </option>
            ))}
          </select>
          {errors.bidang && <p className="text-red-500 text-sm">{errors.bidang}</p>}
        </div>

        <div>
          <input
            type="text"
            name="kode_kelas"
            value={data.kode_kelas}
            onChange={handleChange}
            placeholder="Kode Kelas (Opsional)"
            className="w-full border p-2 rounded"
          />
          {errors.kode_kelas && <p className="text-red-500 text-sm">{errors.kode_kelas}</p>}
        </div>

        <div>
          <label className="block font-medium">Soal</label>
          {data.soal.map((soal, index) => (
            <input
              key={index}
              type="text"
              name="soal"
              value={soal}
              onChange={(e) => handleChange(e, index)}
              placeholder={`ID Soal ke-${index + 1}`}
              className="w-full border p-2 rounded mb-2"
            />
          ))}
          <button type="button" onClick={addSoal} className="text-blue-600 text-sm">
            + Tambah Soal
          </button>
        </div>

        <button
          type="submit"
          disabled={processing}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
