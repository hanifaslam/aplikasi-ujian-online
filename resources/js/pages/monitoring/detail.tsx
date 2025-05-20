import { ContentTitle } from '@/components/content-title';
import { StatCard } from '@/components/stat-card';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { CAlertDialog } from '@/components/c-alert-dialog';
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
}

interface PaginatedMockData {
    data: Student[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    ujian: Ujian;
}

// Mock data for students
const generateMockStudents = (count: number): Student[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Student ${i + 1}`,
        completedQuestions: Math.floor(Math.random() * 100),
        totalQuestions: 100,
        status: Math.random() > 0.5 ? 'active' : 'finish',
    }));
};

export default function Detail({ ujian }: Props) {
    const [studentData, setStudentData] = useState<PaginatedMockData>({
        data: generateMockStudents(10),
        current_page: 1,
        last_page: 5,
        per_page: 10,
        total: 50,
    });

    const [filters, setFilters] = useState({
        search: '',
        page: 1,
    });

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

    const handlePerPageChange = (perPage: number) => {
        setStudentData((prev) => ({
            ...prev,
            per_page: perPage,
            last_page: Math.ceil(prev.total / perPage),
        }));
    };

    const handleSearchChange = (search: string) => {
        setFilters((prev) => ({ ...prev, search, page: 1 }));
        // In a real app, this would trigger a server request
        // For mock data, we'll just simulate filtering
        const filtered = generateMockStudents(50).filter((student) => student.name.toLowerCase().includes(search.toLowerCase()));

        setStudentData({
            data: filtered.slice(0, studentData.per_page),
            current_page: 1,
            last_page: Math.ceil(filtered.length / studentData.per_page),
            per_page: studentData.per_page,
            total: filtered.length,
        });
    };

    const handlePageChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }));
        // For mock data, simulate pagination
        setStudentData((prev) => ({
            ...prev,
            current_page: page,
            data: generateMockStudents(50).slice((page - 1) * prev.per_page, page * prev.per_page),
        }));
    };

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
                            <StatCard title="Total Student" value="500" />
                            <StatCard title="Total Active Student" value="364" />
                            <StatCard title="Total Finished Student" value="200" />
                        </div>
                    </CardContent>
                    <CardFooter />
                </Card>

                <div className="mt-4">
                    <div className="mb-4 flex items-center justify-between">
                        {/* Using select and input for filtering instead of components */}
                        <div>
                            <label className="mr-2">Show entries:</label>
                            <select
                                value={studentData.per_page}
                                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                className="rounded border p-1"
                            >
                                {[10, 25, 50, 100].map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={filters.search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="rounded border p-1"
                            />
                        </div>
                    </div>
                    <StudentTable data={studentData} onPageChange={handlePageChange} />
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

function StudentTable({ data: studentData, onPageChange }: { data: PaginatedMockData; onPageChange: (page: number) => void }) {
    const [open, setOpen] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setTargetId(id);
        setOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (targetId !== null) {
                // In a real app, this would be a server request
                toast.success(`Successfully deleted student ${targetId}`);
            }
        } catch {
            toast.error('Unexpected error occurred');
        } finally {
            setOpen(false);
        }
    };

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
            render: (student: Student) => (
                <div className="flex justify-center">
                    <CButtonIcon icon={Trash2} type="danger" onClick={() => handleDelete(student.id)} />
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex flex-col gap-4">
                <CustomTable columns={columns} data={studentData.data} />

                <PaginationWrapper
                    currentPage={studentData.current_page}
                    lastPage={studentData.last_page}
                    perPage={studentData.per_page}
                    total={studentData.total}
                    onNavigate={onPageChange}
                />
            </div>

            <CAlertDialog
                open={open}
                setOpen={setOpen}
                onContinue={confirmDelete}
                title="Delete Student"
                description="Are you sure you want to delete this student? This action cannot be undone."
            />
        </>
    );
}
