// Penjadwalan Manager Page (migrated from exam-schedule/exam-manager.tsx)
import AppLayout from '@/layouts/app-layout';
import { PageFilter, PageProps, PaginatedResponse, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CAlertDialog } from '@/components/c-alert-dialog';
import { ContentTitle } from '@/components/content-title';
import { CButtonIcon } from '@/components/ui/c-button';
import { CustomTable } from '@/components/ui/c-table';
import { EntriesSelector } from '@/components/ui/entries-selector';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { SearchInputMenu } from '@/components/ui/search-input-menu';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jadwal Ujian',
        href: '/penjadwalan',
    },
];

type JadwalUjian = {
    id_penjadwalan: number;
    id_paket_ujian: number;
    tipe_ujian: string;
    tanggal: string;
    waktu_mulai: string;
    waktu_selesai: string;
    kuota: number;
    status: number;
    jenis_ujian: number;
    kode_jadwal: string;
    online_offline: number;
    flag: number;
};

export default function PenjadwalanManager() {
    const { data: examData, filters, flash } = usePage<PageProps<JadwalUjian>>().props;

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Ujian" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ContentTitle 
                    title="Jadwal Ujian" 
                    showButton 
                    onButtonClick={() => router.visit(route('penjadwalan.create'))} 
                />
                <div className="mt-4 flex items-center justify-between">
                    <EntriesSelector 
                        currentValue={examData.per_page} 
                        options={[10, 25, 50, 100]} 
                        routeName="penjadwalan.index" 
                    />
                    <SearchInputMenu 
                        defaultValue={filters.search} 
                        routeName="penjadwalan.index" 
                    />
                </div>
                <PenjadwalanTable data={examData} pageFilters={filters} />
            </div>
        </AppLayout>
    );
}

function PenjadwalanTable({ data: examData, pageFilters: filters }: { data: PaginatedResponse<JadwalUjian>; pageFilters: PageFilter }) {
    const [open, setOpen] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setTargetId(id);
        setOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (targetId !== null) {
                router.delete(route('penjadwalan.destroy', targetId), {
                    preserveState: true,
                    preserveScroll: true,
                });
            }
        } catch {
            toast.error('Unexpected error occurred');
        } finally {
            setOpen(false);
        }
    };

    const navigateToPage = (page: number) => {
        router.visit(route('penjadwalan.index'), {
            data: {
                page: page,
                search: filters.search,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const columns = [
        {
            label: 'Tipe Ujian',
            render: (exam: JadwalUjian) => exam.tipe_ujian,
        },
        {
            label: 'Paket Ujian',
            render: (exam: JadwalUjian) => exam.id_paket_ujian,
        },
        {
            label: 'Tanggal Ujian',
            render: (exam: JadwalUjian) => new Date(exam.tanggal).toLocaleDateString('id-ID'),
        },
        {
            label: 'Mulai',
            render: (exam: JadwalUjian) => exam.waktu_mulai,
        },
        {
            label: 'Selesai',
            render: (exam: JadwalUjian) => exam.waktu_selesai,
        },
        {
            label: 'Kuota',
            render: (exam: JadwalUjian) => exam.kuota,
        },
        {
            label: 'Tipe',
            render: (exam: JadwalUjian) => exam.online_offline === 1 ? 'Online' : 'Offline',
        },
        {
            label: 'Aksi',
            className: 'w-[100px] text-center',
            render: (exam: JadwalUjian) => (
                <div className="flex justify-center gap-2">
                    <CButtonIcon 
                        icon={Pencil} 
                        onClick={() => router.visit(route('penjadwalan.edit', exam.id_penjadwalan))} 
                    />
                    <CButtonIcon 
                        icon={Trash2} 
                        type="danger" 
                        onClick={() => handleDelete(exam.id_penjadwalan)} 
                    />
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex flex-col gap-4">
                <CustomTable columns={columns} data={examData.data} />

                <PaginationWrapper
                    currentPage={examData.current_page}
                    lastPage={examData.last_page}
                    perPage={examData.per_page}
                    total={examData.total}
                    onNavigate={navigateToPage}
                />
            </div>

            <CAlertDialog open={open} setOpen={setOpen} onContinue={confirmDelete} />
        </>
    );
}
