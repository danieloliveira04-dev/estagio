import HeadingSmall from "@/components/heading-small";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes/admin";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="px-4 py-6">
                <HeadingSmall title="Dashboard" description="Update your account's appearance settings" />
            </div>

        </AppLayout>
    );
}