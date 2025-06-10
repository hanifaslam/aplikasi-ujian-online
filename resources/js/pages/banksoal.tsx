import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { CAlertDialog } from '@/components/c-alert-dialog';
import { ContentTitle } from '@/components/content-title';
import { CButtonIcon } from '@/components/ui/c-button';
import { CustomTable } from '@/components/ui/c-table';
import { EntriesSelector } from '@/components/ui/entries-selector';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { SearchInputMenu } from '@/components/ui/search-input-menu';
import { Listbox } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface PageFilter {
    order: string;
    search?: string;
    kd_mapel?: string; // Tambahkan filter kd_mapel
}

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface PageProps {
    dataSoal: PaginatedResponse<Soal>;
    filters: PageFilter;
    kdMapelOptions: Array<{ kode: string; nama: string }>; // Tambahkan ini
    flash?: {
        success?: string;
        error?: string;
    };
}

interface Soal {
    ids: number;
    suara: string | null;
    header_soal: string | null;
    body_soal: string;
    footer_soal: string | null;
    jw_1: string;
    jw_2: string;
    jw_3: string;
    jw_4: string;
    jw_fix: number;
    jenis_soal: string | null; // Add this line
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bank Soal',
        href: '/master-data/bank-soal',
    },
];

export default function Banksoal() {
    console.log('Raw props:', usePage().props);

    const props = usePage().props as unknown as PageProps;

    const dataSoal = props.dataSoal || {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    };

    const filters = props.filters || { search: '' };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bank Soal" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ContentTitle title="Bank Soal" onButtonClick={() => router.visit('/master-data/bank-soal/create')} />
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <EntriesSelector
                            currentValue={dataSoal.per_page}
                            options={[10, 15, 25, 50]}
                            routeName="master-data.bank.soal"
                            paramName="pages"
                        />
                        <OrderFilter defaultValue={filters?.order ?? 'asc'} />
                    </div>
                    <SearchInputMenu defaultValue={filters?.search} routeName="master-data.bank.soal" />
                </div>
                <BankSoalTable data={dataSoal} pageFilters={filters} />
            </div>
        </AppLayout>
    );
}

function detectMimeType(base64: string): string {
    if (base64.startsWith('/9j/')) return 'image/jpeg';
    if (base64.startsWith('iVBORw0KGgo')) return 'image/png';
    if (base64.startsWith('R0lGOD')) return 'image/gif';
    if (base64.startsWith('UklGR')) return 'image/webp';
    return 'image/jpeg';
}

// Modifikasi options untuk dropdown filter
const options = [
    { label: 'Terlama', value: 'asc' },
    { label: 'Terbaru', value: 'desc' },
];

// Tambahkan state untuk menyimpan opsi jenis ujian
function OrderFilter({ defaultValue }: { defaultValue: string }) {
    const props = usePage().props as unknown as PageProps;
    const filters = props.filters || {};
    const perPage = props.dataSoal?.per_page || 10;
    const kdMapelOptions = props.kdMapelOptions || []; // Ambil opsi dari props

    const [order, setOrder] = useState(defaultValue);
    const [selectedKdMapel, setSelectedKdMapel] = useState(filters.kd_mapel || '');

    const handleChange = (selected: string) => {
        setOrder(selected);
        router.visit(route('master-data.bank.soal'), {
            data: {
                order: selected,
                search: filters.search || '',
                pages: perPage,
                kd_mapel: selectedKdMapel,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleKdMapelChange = (selected: string) => {
        setSelectedKdMapel(selected);
        router.visit(route('master-data.bank.soal'), {
            data: {
                order: order,
                search: filters.search || '',
                pages: perPage,
                kd_mapel: selected,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="flex gap-4">
            {/* Order Filter */}
            <div className="relative w-[150px]">
                <Listbox value={order} onChange={handleChange}>
                    <div className="relative">
                        <Listbox.Button className="w-[100px] rounded-lg border border-gray-300 px-3 py-2 text-left text-sm text-gray-700">
                            {options.find((o) => o.value === order)?.label}
                            <span className="pointer-events-none absolute inset-y-0 right-15 flex items-center">
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </span>
                        </Listbox.Button>

                        <Listbox.Options className="absolute z-10 mt-1 w-[100px] rounded-lg border border-gray-200 bg-white shadow">
                            {options.map((option) => (
                                <Listbox.Option
                                    key={option.value}
                                    value={option.value}
                                    className={({ active }) =>
                                        `cursor-pointer px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`
                                    }
                                >
                                    {option.label}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </div>
                </Listbox>
            </div>

            {/* Kd Mapel Filter */}
            <div className="relative left-[-50px] w-[250px]">
                <Listbox value={selectedKdMapel} onChange={handleKdMapelChange}>
                    <div className="relative">
                        <Listbox.Button className="w-full rounded-lg border border-gray-300 px-3 py-2 text-left text-sm text-gray-700">
                            {selectedKdMapel
                                ? kdMapelOptions.find((o) => o.kode === selectedKdMapel)?.nama || 'Semua Jenis Ujian'
                                : 'Semua Jenis Ujian'}
                            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </span>
                        </Listbox.Button>

                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow">
                            <Listbox.Option
                                value=""
                                className={({ active }) =>
                                    `cursor-pointer px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`
                                }
                            >
                                Semua Jenis Ujian
                            </Listbox.Option>
                            {kdMapelOptions.map((option) => (
                                <Listbox.Option
                                    key={option.kode}
                                    value={option.kode}
                                    className={({ active }) =>
                                        `cursor-pointer px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`
                                    }
                                >
                                    {`${option.kode} - ${option.nama}`}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </div>
                </Listbox>
            </div>
        </div>
    );
}

function renderContentWithBase64(content: string | null) {
    if (!content) return null;

    const isProbablyBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(content) && content.length > 100;

    if (isProbablyBase64) {
        const mimeType = detectMimeType(content);
        const imageSrc = `data:${mimeType};base64,${content}`;
        return <img src={imageSrc} alt="gambar" className="max-h-60 max-w-full rounded object-contain" />;
    }

    // Menangani HTML yang mungkin ada
    return <span className="text-base font-medium whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content }} />;
}

function BankSoalTable({ data, pageFilters }: { data: PaginatedResponse<Soal>; pageFilters: PageFilter }) {
    const [open, setOpen] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setTargetId(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (targetId !== null) {
            router.delete(route('master-data.bank.soal.destroy', targetId), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Soal berhasil dihapus');
                },
            });
        }
        setOpen(false);
    };

    const navigateToPage = (page: number) => {
        router.visit(route('master-data.bank.soal'), {
            data: {
                page: page,
                search: pageFilters?.search,
                pages: data.per_page,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const columns = [
        {
            label: 'No',
            className: 'w-[60px] text-center',
            render: (item: Soal) => <div className="text-center">{item.ids}</div>,
        },
        {
            label: 'Kode Soal',
            className: 'w-[100px]',
            render: (item: Soal) => <div className="text-center">{item.jenis_soal || '-'}</div>,
        },
        {
            label: 'Soal',
            //className: 'text-center',
            render: (item: Soal) => (
                <div className="flex max-w-[900px] flex-col gap-2 break-words whitespace-pre-wrap">
                    {/* Suara jika ada */}
                    {item.suara && <audio controls src={`/storage/${item.suara}`} className="w-[250px] max-w-full" />}

                    {renderContentWithBase64(item.header_soal)}
                    {renderContentWithBase64(item.body_soal)}
                    {renderContentWithBase64(item.footer_soal)}

                    {/* Pilihan Jawaban */}
                    <ul className="space-y-2 text-base font-medium">
                        {[item.jw_1, item.jw_2, item.jw_3, item.jw_4].map((jw, idx) => {
                            const huruf = String.fromCharCode(65 + idx);
                            const isCorrect = idx === item.jw_fix;
                            return (
                                <li key={idx} className={`flex ${isCorrect ? 'font-semibold text-green-600' : ''} max-w-[900px]`}>
                                    {/* Huruf A, B, C */}
                                    <span className="mr-2 flex-shrink-0">{huruf}.</span>
                                    {/* Isi jawaban */}
                                    <div className="break-words whitespace-pre-wrap">{renderContentWithBase64(jw)}</div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ),
        },
        {
            label: 'Action',
            className: 'w-[100px] text-center',
            render: (item: Soal) => (
                <div className="flex justify-center gap-2">
                    <CButtonIcon icon={Pencil} onClick={() => router.visit(route('master-data.bank.soal.edit', item.ids))} />
                    <CButtonIcon icon={Trash2} type="danger" onClick={() => handleDelete(item.ids)} />
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex flex-col gap-4">
                <CustomTable columns={columns} data={data.data} />
                <PaginationWrapper
                    currentPage={data.current_page}
                    lastPage={data.last_page}
                    perPage={data.per_page}
                    total={data.total}
                    onNavigate={navigateToPage}
                />
            </div>
            <CAlertDialog open={open} setOpen={setOpen} onContinue={confirmDelete} />
        </>
    );
}
