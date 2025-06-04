import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Manager',
        href: '/roles',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <h1>Hello World</h1>
                    <span>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. In et nemo, perferendis a voluptate tenetur inventore adipisci eum
                        dolores sit est natus eos totam illum odio! At ex amet laboriosam?
                    </span>
                </div>
            </div>
        </AppLayout>
    );
}
