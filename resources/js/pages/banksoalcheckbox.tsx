import AppLayout from '@/layouts/app-layout';
import { Listbox } from '@headlessui/react';
import { Head, router, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// import { CAlertDialog } from '@/components/c-alert-dialog';
import { ContentTitleNoadd } from '@/components/content-title-no-add';
import { CustomTable } from '@/components/ui/c-table';
import { EntriesSelector } from '@/components/ui/entries-selector';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { SearchInputMenu } from '@/components/ui/search-input-menu';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface PageFilter {
    order: string;
    search?: string;
}

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
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
}

interface PageProps {
    dataSoal: PaginatedResponse<Soal>;
    filters: PageFilter;
    flash?: {
        success?: string;
        error?: string;
    };
    matchedSoalIds?: number[];
    paketSoal?: {
        id: number;
        nama_paket: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bank Soal Check Box',
        href: '/master-data/banksoalcheckbox',
    },
];

export default function Banksoal() {
    const props = usePage().props as unknown as PageProps;
    const dataSoal = props.dataSoal;
    const filters = props.filters || { search: '', order: 'asc' };
    const paketSoal = props.paketSoal;

    const [selectedSoalIds, setSelectedSoalIds] = useState<number[]>(props.matchedSoalIds || []);

    useEffect(() => {
        if (props.flash?.success) toast.success(props.flash.success);
        if (props.flash?.error) toast.error(props.flash.error);
    }, [props.flash]);

    const handleSave = () => {
        if (!paketSoal) return;

        router.put(
            route('master-data.bank-soal-checkbox.update', paketSoal.id),
            {
                soal_id: selectedSoalIds,
            },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Soal berhasil diperbarui'),
                onError: () => toast.error('Gagal menyimpan soal'),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bank Soal Check Box" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ContentTitleNoadd title="Bank Soal Check Box" />
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
                <BankSoalTable data={dataSoal} pageFilters={filters} selectedSoalIds={selectedSoalIds} setSelectedSoalIds={setSelectedSoalIds} />

                {paketSoal && (
                    <button onClick={handleSave} className="mt-4 self-start rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Simpan Checklist Soal
                    </button>
                )}
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

function renderContentWithBase64(content: string | null) {
    if (!content) return null;
    const isProbablyBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(content) && content.length > 100;

    if (isProbablyBase64) {
        const mimeType = detectMimeType(content);
        const imageSrc = `data:${mimeType};base64,${content}`;
        return <img src={imageSrc} alt="gambar" className="max-h-60 max-w-full rounded object-contain" />;
    }

    return <span className="text-base font-medium whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content }} />;
}

function OrderFilter({ defaultValue }: { defaultValue: string }) {
    const props = usePage().props as unknown as PageProps;
    const filters = props.filters || {};
    const perPage = props.dataSoal?.per_page || 10;
    const [order, setOrder] = useState(defaultValue);

    const handleChange = (selected: string) => {
        setOrder(selected);
        router.visit(route('master-data.bank-soal'), {
            data: {
                order: selected,
                search: filters.search || '',
                pages: perPage,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const options = [
        { label: 'Terlama', value: 'asc' },
        { label: 'Terbaru', value: 'desc' },
    ];

    return (
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
    );
}

function BankSoalTable({
    data,
    pageFilters,
    selectedSoalIds,
    setSelectedSoalIds,
}: {
    data: PaginatedResponse<Soal>;
    pageFilters: PageFilter;
    selectedSoalIds: number[];
    setSelectedSoalIds: (ids: number[]) => void;
}) {
    const navigateToPage = (page: number) => {
        router.visit(route('master-data.bank.soal'), {
            data: {
                page,
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
            label: 'Soal',
            render: (item: Soal) => (
                <div className="flex max-w-[900px] flex-col gap-2 break-words whitespace-pre-wrap">
                    {item.suara && <audio controls src={`/storage/${item.suara}`} className="w-[250px] max-w-full" />}
                    {renderContentWithBase64(item.header_soal)}
                    {renderContentWithBase64(item.body_soal)}
                    {renderContentWithBase64(item.footer_soal)}
                    <ul className="space-y-2 text-base font-medium">
                        {[item.jw_1, item.jw_2, item.jw_3, item.jw_4].map((jw, idx) => {
                            const huruf = String.fromCharCode(65 + idx);
                            const isCorrect = idx === item.jw_fix;
                            return (
                                <li key={idx} className={`flex ${isCorrect ? 'font-semibold text-green-600' : ''} max-w-[900px]`}>
                                    <span className="mr-2 flex-shrink-0">{huruf}.</span>
                                    <div className="break-words whitespace-pre-wrap">{renderContentWithBase64(jw)}</div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ),
        },
        {
            label: 'Checklist',
            className: 'w-[100px] text-center',
            render: (item: Soal) => {
                const isSelected = selectedSoalIds.includes(item.ids);
                return (
                    <div className="flex h-full w-full items-center justify-center">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                                setSelectedSoalIds((prev) => (prev.includes(item.ids) ? prev.filter((id) => id !== item.ids) : [...prev, item.ids]));
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        />
                    </div>
                );
            },
        },
    ];

    return (
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
    );
}
