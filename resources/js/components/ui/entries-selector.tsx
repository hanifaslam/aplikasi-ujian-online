import { router, usePage } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface EntriesSelectorProps {
    currentValue: number;
    options?: number[];
    routeName: string;
    paramName?: string;
}

interface PageFilter {
    order: string;
    search?: string;
    page?: number;
}

export function EntriesSelector({
    currentValue,
    options = [10, 25, 50, 100],
    routeName,
    paramName = "pages"
}: EntriesSelectorProps) {
    const filters = usePage().props.filters as PageFilter;
    const currentPage = filters.page || 1;

    return (
        <div className="flex items-center gap-2">
            <p>Show</p>
            <Select
                value={String(currentValue)}
                onValueChange={(value) => {
                    router.visit(route(routeName), {
                        data: {
                            [paramName]: value,
                            page: currentPage,
                            search: filters.search || '',
                        },
                        preserveState: true,
                        preserveScroll: true,
                    });
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder={String(currentValue)} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={String(option)}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p>entries</p>
        </div>
    );
}
