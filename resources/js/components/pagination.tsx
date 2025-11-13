import { router } from "@inertiajs/react";
import { PaginationLink } from "@/types";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
    links: PaginationLink[];
    className?: string;
}

export default function Pagination({ links, className }: PaginationProps) {
    const handlePage = (url: string | null) => {
        if (url) router.get(url, {}, { preserveState: true, replace: true });
    };

    const prev = links[0];       
    const next = links[links.length - 1]; 

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Button variant="ghost" onClick={() => handlePage(prev.url)} className={cn('cursor-pointer', !prev.url ? 'pointer-events-none opacity-60' : '')}>
                <ChevronLeft /> Anterior
            </Button>

            {links.slice(1, -1).map(link => (
                <Button variant={link.active ? 'outline' : 'ghost'} onClick={() => handlePage(link.url)} className="cursor-pointer">
                    {link.label}
                </Button>
            ))}

            <Button variant="ghost" onClick={() => handlePage(next.url)} className={cn('cursor-pointer', !next.url ? 'pointer-events-none opacity-60' : '')}>
                Próximo <ChevronRight /> 
            </Button>
        </div>
    );
}


{/* <div className="flex gap-2 mt-4">
            {links.map((link, index) => (
                <button
                    key={index}
                    disabled={!link.url}
                    onClick={() => handlePage(link.url)}
                    className={`
                        px-3 py-1 rounded
                        ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}
                        ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}
                    `}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div> */}