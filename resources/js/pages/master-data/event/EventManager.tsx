import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { List, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { CAlertDialog } from '@/components/c-alert-dialog';
import { ContentTitle } from '@/components/content-title';
import { CButtonIcon } from '@/components/ui/c-button';
import { CustomTable } from '@/components/ui/c-table';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { SearchInputMenu } from '@/components/ui/search-input-menu';
import { EntriesSelector } from '@/components/ui/entries-selector';

const breadcrumbs = [{ title: 'Event', href: '/master-data/event' }];

interface EventType {
    id: number;
    nama: string;
    status: 'aktif' | 'tidak-aktif';
}

const dummyData: EventType[] = [
    { id: 1, nama: 'Tryout Nasional', status: 'aktif' },
    { id: 2, nama: 'Simulasi CBT', status: 'tidak-aktif' },
    { id: 3, nama: 'Ujian Tengah Semester', status: 'aktif' },
    { id: 4, nama: 'TOEFL Internal', status: 'aktif' },
    { id: 5, nama: 'Remedial TEPPS', status: 'tidak-aktif' },
];

export default function EventManager() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Event" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ContentTitle title="Data Event" showButton onButtonClick={() => alert('Tambah Event')} />

                <div className="mt-4 flex items-center justify-between">
                    <EntriesSelector currentValue={10} options={[10, 25, 50]} routeName="#" />
                    <SearchInputMenu defaultValue={''} routeName="#" />
                </div>

                <EventTable data={dummyData} />
            </div>
        </AppLayout>
    );
}

function EventTable({ data }: { data: EventType[] }) {
    const [open, setOpen] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setTargetId(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        toast.success(`Event dengan ID ${targetId} berhasil dihapus`);
        setOpen(false);
    };

    const columns = [
        {
            label: 'ID',
            className: 'text-center w-[100px]',
            render: (event: EventType) => (
                <div className="text-center font-medium">{event.id}</div>
            ),
        },
        {
            label: 'Nama Event',
            className: 'text-left w-[400px]',
            render: (event: EventType) => <div>{event.nama}</div>,
        },
            {
    label: 'Status',
    className: 'text-center w-[200px]',
    render: (event: EventType) => (
        <div className="flex justify-center">
        <span
            className={`px-3 py-1 rounded text-white font-semibold text-sm ${
            event.status === 'aktif' ? 'bg-green-600' : 'bg-red-600'
            }`}
        >
            {event.status === 'aktif' ? 'Active' : 'Inactive'}
        </span>
        </div>
    ),
    },  


        {
            label: 'Action',
            className: 'text-center w-[150px]',
            render: (event: EventType) => (
                <div className="flex justify-center gap-2">
                    <CButtonIcon icon={List} className="bg-yellow-500" onClick={() => alert(`Detail event ${event.id}`)} />
                    <CButtonIcon icon={Pencil} onClick={() => alert(`Edit event ${event.id}`)} />
                    <CButtonIcon icon={Trash2} type="danger" onClick={() => handleDelete(event.id)} />
                </div>
            ),
        },
    ];

    return (
        <>
            <CustomTable columns={columns} data={data} />
            <PaginationWrapper currentPage={1} lastPage={1} perPage={10} total={data.length} onNavigate={() => {}} />
            <CAlertDialog open={open} setOpen={setOpen} onContinue={confirmDelete} />
        </>
    );
}
