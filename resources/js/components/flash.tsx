import { ElementType } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon, TriangleAlert } from "lucide-react";
import { FlashType } from "@/types";

export interface FlashProps {
    flash?: FlashType;
    className?: string;
}

const variantMap: Record<FlashType['type'], "success" | "destructive" | "default"> = {
    success: "success",
    error: "destructive",
    warning: "default",
    info: "default",
};

const iconMap: Record<string, ElementType> = {
  success: CheckCircle2Icon,
  error: AlertCircleIcon,
  warning: TriangleAlert, 
  info: InfoIcon,
};


export default function Flash({ flash, className }: FlashProps) {
    if(!flash) return null;

    const variant = variantMap[flash.type] ?? 'default';
    const Icon: ElementType | null  = iconMap[flash.type] ?? null;

    return (
        <Alert className={className} variant={variant} >
            <Icon />
            <AlertTitle>{flash.message}</AlertTitle>
            {flash.description && (
                <AlertDescription>{flash.description}</AlertDescription>
            )}
        </Alert>
    );
}