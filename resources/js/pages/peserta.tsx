import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Peserta',
        href: '/peserta',
    },
];

export default function Peserta() {
    const [peserta, setPeserta] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingData, setEditingData] = useState(null);

    const { data, setData, post, put, reset, errors } = useForm({
        nama: '',
        email: '',
        // Tambahkan field lain sesuai dengan StorePesertaRequest.php
    });

    useEffect(() => {
        fetchPeserta();
    }, []);

    const fetchPeserta = async () => {
        try {
            const response = await axios.get('/peserta'); // Sesuaikan dengan route Laravel Anda
            setPeserta(response.data);
        } catch (error) {
            console.error('Error fetching peserta:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEditing && editingData) {
            put(`/peserta/${editingData.id}`, {
                onSuccess: () => {
                    fetchPeserta();
                    reset();
                    setIsEditing(false);
                },
            });
        } else {
            post('/peserta', {
                onSuccess: () => {
                    fetchPeserta();
                    reset();
                },
            });
        }
    };

    const handleEdit = (peserta) => {
        setIsEditing(true);
        setEditingData(peserta);
        setData({
            nama: peserta.nama,
            email: peserta.email,
            // Set field lain sesuai dengan data peserta
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/peserta/${id}`); // Sesuaikan dengan route Laravel Anda
            fetchPeserta();
        } catch (error) {
            console.error('Error deleting peserta:', error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Peserta" />
            <div className="p-4">
                <h1 className="text-xl font-bold">Manajemen Peserta</h1>
                <form onSubmit={handleSubmit} className="my-4 space-y-4">
                    <div>
                        <label htmlFor="nama" className="block text-sm font-medium">
                            Nama
                        </label>
                        <input
                            id="nama"
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.nama && <div className="text-red-500 text-sm">{errors.nama}</div>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                    </div>
                    {/* Tambahkan field lain sesuai dengan StorePesertaRequest.php */}
                    <button
                        type="submit"
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                        {isEditing ? 'Update Peserta' : 'Tambah Peserta'}
                    </button>
                </form>
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Nama</th>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {peserta.map((item) => (
                            <tr key={item.id}>
                                <td className="border border-gray-300 px-4 py-2">{item.nama}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.email}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="mr-2 rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}