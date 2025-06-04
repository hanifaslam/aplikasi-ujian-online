import { ContentTitle } from '@/components/content-title';
import { StatCard } from '@/components/stat-card';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { CButtonIcon } from '@/components/ui/c-button';
import { CustomTable } from '@/components/ui/c-table';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';

interface Ujian {
    id: number;
    tipe_ujian: string;
    paket_ujian: string;
    kelas_prodi: string;
    tanggal_ujian: string;
    mulai: string;
    selesai: string;
    kuota: number;
    tipe: string;
}

interface Student {
    id: number;
    name: string;
    completedQuestions: number;
    totalQuestions: number;
    status: 'active' | 'finish';
    nilai?: number;
}

interface StudentsData {
    data: Student[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Stats {
    total_students: number;
    active_students: number;
    finished_students: number;
}

interface DebugInfo {
    participantIds: number[];
    jadwalUjianSoal: Record<string, unknown>;
    totalQuestions: number;
    pengerjaanList: Record<string, unknown>;
    finished_students: number;
}

interface Props {
    ujian: Ujian;
    studentsData: StudentsData;
    stats: Stats;
    debug?: DebugInfo; // For debugging purposes
}

export default function Detail({ ujian, studentsData, stats, debug }: Props) {
    const breadcrumbs = [
        {
            title: 'Monitoring Ujian',
            href: '/monitoring-ujian',
        },
        {
            title: 'Detail',
            href: '#',
        },
    ];

    const handlePageChange = (page: number) => {
        router.get(
            route('monitoring.ujian.show', ujian.id),
            {
                page,
                perPage: studentsData.per_page,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    // log the data from the props
    console.log('Ujian Data:', ujian);
    console.log('Students Data:', studentsData);
    console.log('Stats:', stats);
    if (debug) {
        console.log('Debug Info:', debug);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail ${ujian.paket_ujian}`} />

            <div className="flex flex-col gap-4 p-4">
                <ContentTitle
                    title="Detail Ujian"
                    showButton
                    showIcon={false}
                    buttonText="Kembali"
                    onButtonClick={() => router.visit(route('monitoring.ujian'))}
                />

                <Card className="flex flex-col gap-4 p-4">
                    <CardHeader>
                        <CardTitle className="text-2xl">{ujian.paket_ujian}</CardTitle>
                        <CardDescription>{ujian.tipe_ujian}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex w-full gap-2">
                            <StatCard title="Total Student" value={stats.total_students.toString()} />
                            <StatCard title="Total Active Student" value={stats.active_students.toString()} />
                            <StatCard title="Total Finished Student" value={stats.finished_students.toString()} />
                        </div>
                    </CardContent>
                    <CardFooter />
                </Card>

                <div className="mt-4">
                    <div className="mb-4 flex items-center justify-between">
                        {/* Using select and input for filtering instead of components */}
                        {/* <div className="mt-4 flex items-center justify-between">
                            <EntriesSelector currentValue={ujianList.per_page} options={[10, 25, 50, 100]} routeName="monitoring-ujian" />
                            <SearchInputMenu defaultValue={filters.search} routeName="monitoring-ujian" />
                        </div> */}
                    </div>
                    <StudentTable data={studentsData} onPageChange={handlePageChange} />
                </div>
            </div>
        </AppLayout>
    );
}

// Status badge component
const StatusBadge: React.FC<{ status: 'active' | 'finish' }> = ({ status }) => {
    switch (status) {
        case 'active':
            return <span className="rounded bg-green-500 p-2 text-white shadow">Active</span>;
        case 'finish':
            return <span className="rounded bg-blue-500 p-2 text-white shadow">Finish</span>;
        default:
            return <span className="rounded bg-gray-500 p-2 text-white shadow">{status}</span>;
    }
};

function StudentTable({ data: studentsData, onPageChange }: { data: StudentsData; onPageChange: (page: number) => void }) {
    const columns = [
        {
            label: 'No',
            className: 'w-[80px] text-center',
            render: (student: Student) => <div className="text-center font-medium">{student.id}</div>,
        },
        {
            label: 'Nama',
            className: 'w-[300px]',
            render: (student: Student) => student.name,
        },
        {
            label: 'Soal',
            className: 'w-[150px]',
            render: (student: Student) => `${student.completedQuestions}/${student.totalQuestions}`,
        },
        {
            label: 'Status',
            className: 'w-[150px]',
            render: (student: Student) => <StatusBadge status={student.status} />,
        },
        {
            label: 'Action',
            className: 'w-[100px] text-center',
            render: () => (
                <div className="flex justify-center">
                    <CButtonIcon
                        icon={Trash2}
                        type="danger"
                        className="cursor-not-allowed opacity-50"
                        onClick={() => {
                            toast.info('Delete functionality is currently disabled');
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex flex-col gap-4">
                <CustomTable columns={columns} data={studentsData.data} />

                <PaginationWrapper
                    currentPage={studentsData.current_page}
                    lastPage={studentsData.last_page}
                    perPage={studentsData.per_page}
                    total={studentsData.total}
                    onNavigate={onPageChange}
                />
            </div>
        </>
    );
}
