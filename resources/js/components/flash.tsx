import { ElementType, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon, TriangleAlert, X } from "lucide-react";
import { FlashType } from "@/types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export interface FlashProps {
    flash?: FlashType;
    className?: string;
}

const variantMap: Record<FlashType['type'], "success" | "destructive" | "warning" | "default"> = {
    success: "success",
    error: "destructive",
    warning: "warning",
    info: "default",
};

const iconMap: Record<string, ElementType> = {
  success: CheckCircle2Icon,
  error: AlertCircleIcon,
  warning: TriangleAlert, 
  info: InfoIcon,
};

export default function Flash({ flash, className }: FlashProps) {
    const [closed, setClosed] = useState(false);

    // Sempre que o flash mudar, reabre o alerta
    useEffect(() => {
        setClosed(false);
    }, [flash]);

    if (!flash || closed) return null;
    
    const variant = variantMap[flash.type] ?? 'default';
    const Icon: ElementType | null = iconMap[flash.type] ?? null;

    return (
        <Alert className={cn(className, "pr-10")} variant={variant}>
            {Icon && <Icon className="h-4 w-4" />}
            <AlertTitle>{flash.message}</AlertTitle>
            {flash.description && (
                <AlertDescription>
                    {flash.description}
                </AlertDescription>
            )}

            <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 -translate-y-1/2 right-2 size-6 hover:bg-neutral-300/10 cursor-pointer"
                onClick={() => setClosed(true)}
            >
                <X />
            </Button>
        </Alert>
    );
}