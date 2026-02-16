'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UploadCloud, X } from 'lucide-react';
import * as React from 'react';

export interface FileUploadMultipleProps {
    value?: File[];
    onChange?: (files: File[]) => void;
}

export function FileUploadMultiple({ value, onChange }: FileUploadMultipleProps) {
    const files = value ?? [];

    const handleFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;

        const fileArray = Array.from(newFiles);
        onChange?.([...files, ...fileArray]);
    };

    const removeFile = (index: number) => {
        onChange?.(files.filter((_, i) => i !== index));
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    return (
        <Card className="space-y-4 p-6">
            <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition hover:bg-muted/50"
            >
                <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                    Clique ou arraste arquivos aqui
                </span>
                <span className="text-xs text-muted-foreground">
                    PNG, JPG, PDF até 5MB
                </span>

                <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />
            </label>

            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between rounded-md border p-3"
                        >
                            <div>
                                <p className="max-w-xs truncate text-sm font-medium">
                                    {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>

                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => removeFile(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}