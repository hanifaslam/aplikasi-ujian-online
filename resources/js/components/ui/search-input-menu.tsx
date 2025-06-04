import { router } from "@inertiajs/react";
import { Search } from "lucide-react";
import { Input } from "./input";

interface SearchInputMenuProps {
    defaultValue?: string;
    placeholder?: string;
    routeName: string;
    paramName?: string;
    width?: string;
}

export function SearchInputMenu({
    defaultValue = "",
    placeholder = "Search...",
    routeName,
    paramName = "search",
    width = "w-[300px]"
}: SearchInputMenuProps) {
    return (
        <div className={`relative ${width}`}>
            <Input
                type="text"
                placeholder={placeholder}
                className="pl-10"
                defaultValue={defaultValue}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        router.visit(route(routeName), {
                            data: { [paramName]: (e.target as HTMLInputElement).value },
                            preserveState: true,
                            preserveScroll: true,
                        });
                    }
                }}
            />
            <Search className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform" />
        </div>
    );
}
