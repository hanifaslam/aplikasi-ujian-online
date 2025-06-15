import React, { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function CreatePaketSoal() {
  const [bidangs, setBidangs] = useState<{ kode: number; nama_bidang: string }[]>([]);
  const [success, setSuccess] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    nama_paket_ujian: '',
    kode_bidang: '',
    jenis_ujian: '',
    soal: [''],
  });

  useEffect(() => {
    axios.get('/bidangs').then(res => {
      setBidangs(res.data);
    });
  }, []);

  const handleSoalChange = (index: number, value: string) => {
    const newSoal = [...data.soal];
    newSoal[index] = value;
    setData('soal', newSoal);
  };

  const addSoal = () => {
    setData('soal', [...data.soal, '']);
  };

  const removeSoal = (index: number) => {
    const newSoal = data.soal.filter((_, i) => i !== index);
    setData('soal', newSoal);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData(e.target.name as keyof typeof data, e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('master-data.paket-soal.store'), {
      onSuccess: () => {
        setSuccess(true);
        reset();
        setTimeout(() => setSuccess(false), 3000);
      },
    });
  };

  type PageProps = {
    flash?: {
      success?: string;
    };
    [key: string]: unknown;
  };

  const { props } = usePage<PageProps>();
  const flashSuccess = props.flash?.success;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Buat Paket Soal</h2>
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Paket soal berhasil dibuat!
        </div>
      )}
      {flashSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {flashSuccess}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nama Paket Ujian</label>
          <input
            type="text"
            name="nama_paket_ujian"
            value={data.nama_paket_ujian}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.nama_paket_ujian && <p className="text-red-500 text-sm">{errors.nama_paket_ujian}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Bidang</label>
          <select
            name="kode_bidang"
            value={data.kode_bidang}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Pilih Bidang</option>
            {bidangs.map((bidang) => (
              <option key={bidang.kode} value={bidang.kode}>
                {bidang.nama_bidang}
              </option>
            ))}
          </select>
          {errors.kode_bidang && <p className="text-red-500 text-sm">{errors.kode_bidang}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Jenis Ujian</label>
          <input
            type="text"
            name="jenis_ujian"
            value={data.jenis_ujian}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.jenis_ujian && <p className="text-red-500 text-sm">{errors.jenis_ujian}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Soal (ID Soal, minimal 1)</label>
          {data.soal.map((item, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                name={`soal[${idx}]`}
                value={item}
                onChange={e => handleSoalChange(idx, e.target.value)}
                placeholder={`ID Soal ke-${idx + 1}`}
                className="w-full border px-3 py-2 rounded"
              />
              {data.soal.length > 1 && (
                <button
                  type="button"
                  className="text-red-600"
                  onClick={() => removeSoal(idx)}
                >
                  Hapus
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addSoal} className="text-blue-600 text-sm">
            + Tambah Soal
          </button>
          {errors.soal && <p className="text-red-500 text-sm">{errors.soal}</p>}
        </div>
        <button
          type="submit"
          disabled={processing}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}