import { CButton } from '@/components/ui/c-button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Validasi schema
const formSchema = z.object({
    nama_event: z.string().min(2).max(255),
    status: z.number().refine(val => val === 1 || val === 0),
});

export default function FormEventDetail() {
    const { event } = usePage<{
        event: {
            id_event?: string;
            nama_event?: string;
            status?: number;
            mulai_event?: string;
            akhir_event?: string;
            create_event?: string;
        } | null;
    }>().props;

    const form = useForm<{
        nama_event: string;
        status: number;
    }>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama_event: event?.nama_event ?? '',
            status: event?.status ?? 1, // ini udah aman, fallback ke 1 cuma kalau null/undefined
        },
    });

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Event', href: '/master-data/event' },
                { title: 'Detail', href: '#' },
            ]}
        >
            <Head title="Detail Event" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Detail Event</h1>
                    <CButton
                        type="primary"
                        onClick={() => router.visit('/master-data/event')}
                    >
                        Kembali
                    </CButton>
                </div>

                <Form {...form}>
                    <form className="space-y-4">
                        {/* Nama Event */}
                        <FormField
                            control={form.control}
                            name="nama_event"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Event</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled
                                            className="text-black bg-gray-100 cursor-not-allowed"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Input
                                            value={field.value === 1 ? 'Aktif' : 'Tidak Aktif'}
                                            disabled
                                            className="text-black bg-gray-100 cursor-not-allowed"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
}
