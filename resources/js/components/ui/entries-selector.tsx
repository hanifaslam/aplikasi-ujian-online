import { router } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface EntriesSelectorProps {
    currentValue: number;
    options?: number[];
    routeName: string;
    paramName?: string;
}

export function EntriesSelector({
    currentValue,
    options = [10, 25, 50, 100],
    routeName,
    paramName = "pages"
}: EntriesSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <p>Show</p>
            <Select
                value={String(currentValue)}
                onValueChange={(value) => {
                    router.visit(route(routeName), {
                        data: { [paramName]: value },
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
