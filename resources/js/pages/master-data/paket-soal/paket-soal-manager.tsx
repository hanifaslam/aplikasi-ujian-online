import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { List, Pencil, Trash2 } from 'lucide-react';

import { CAlertDialog } from '@/components/c-alert-dialog';
import { ContentTitle } from '@/components/content-title';
import { CButtonIcon } from '@/components/ui/c-button';
import { CustomTable } from '@/components/ui/c-table';
import { EntriesSelector } from '@/components/ui/entries-selector';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { SearchInputMenu } from '@/components/ui/search-input-menu';

interface PaketSoalType {
  id: number;
  nama: string;
  event: string;
  bidang: string;
  jumlah: number;
}

const dummyData: PaketSoalType[] = [
  { id: 1, nama: 'Listening Paket 1', event: 'Tryout', bidang: 'Listening', jumlah: 25 },
  { id: 2, nama: 'Reading Paket 2', event: 'UTS Genap', bidang: 'Reading', jumlah: 30 },
  { id: 3, nama: 'Structure Paket 1', event: 'TOEFL Internal', bidang: 'Structure', jumlah: 20 },
  { id: 4, nama: 'Reading Paket 1', event: 'Tryout', bidang: 'Reading', jumlah: 25 },
  { id: 5, nama: 'Listening Paket 2', event: 'UTS Genap', bidang: 'Listening', jumlah: 15 },
];

export default function PaketSoalManager() {
  const [open, setOpen] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);

  useEffect(() => {
    toast.success('Paket soal dimuat');
  }, []);

  const handleDelete = (id: number) => {
    setTargetId(id);
    setOpen(true);
  };

  const confirmDelete = () => {
    toast.success(`Paket soal dengan ID ${targetId} berhasil dihapus`);
    setOpen(false);
  };

  const breadcrumbs = [{ title: 'Paket Soal', href: '/master-data/paket-soal' }];

  const columns = [
    { label: 'ID', className: 'text-center w-[80px]', render: (d: PaketSoalType) => <div className="text-center">{d.id}</div> },
    { label: 'Nama Paket Soal', className: 'w-[300px]', render: (d: PaketSoalType) => d.nama },
    { label: 'Event', className: 'w-[200px]', render: (d: PaketSoalType) => d.event },
    { label: 'Bidang', className: 'w-[150px]', render: (d: PaketSoalType) => d.bidang },
    {
      label: 'Jumlah Soal',
      className: 'text-center w-[150px]',
      render: (d: PaketSoalType) => <div className="text-center">{d.jumlah}</div>,
    },
    {
      label: 'Action',
      className: 'text-center w-[150px]',
      render: (d: PaketSoalType) => (
        <div className="flex justify-center gap-2">
          <CButtonIcon icon={List} className="bg-yellow-500" onClick={() => router.visit(`/master-data/paket-soal/${d.id}/detail`)} />
          <CButtonIcon icon={Pencil} onClick={() => router.visit(`/master-data/paket-soal/${d.id}/edit`)} />
          <CButtonIcon icon={Trash2} type="danger" onClick={() => handleDelete(d.id)} />
        </div>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Data Paket Soal" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <ContentTitle title="Data Paket Soal" showButton onButtonClick={() => router.visit('/master-data/paket-soal/create-paket-soal')} />

        <div className="mt-4 flex items-center justify-between">
          <EntriesSelector currentValue={10} options={[10, 25, 50]} routeName="#" />
          <SearchInputMenu defaultValue={''} routeName="#" />
        </div>

        <CustomTable columns={columns} data={dummyData} />
        <PaginationWrapper
          currentPage={1}
          lastPage={1}
          perPage={10}
          total={dummyData.length}
          onNavigate={() => {}}
        />

        <CAlertDialog open={open} setOpen={setOpen} onContinue={confirmDelete} />
      </div>
    </AppLayout>
  );
}
