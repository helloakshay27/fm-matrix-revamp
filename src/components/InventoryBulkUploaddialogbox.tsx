import React, { useCallback, useRef, useState } from 'react';
import { X, Upload } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    // Optional callback after successful import to let parent refresh
    onImported?: () => void;
};

export const InventoryBulkUploadDialog: React.FC<Props> = ({
    open,
    onOpenChange,
    title = 'Bulk Upload',
    onImported,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const close = useCallback(() => {
        setFile(null);
        setDragActive(false);
        setSubmitting(false);
        onOpenChange(false);
    }, [onOpenChange]);

    const onChooseClick = () => inputRef.current?.click();

    const handleFiles = (files?: FileList | null) => {
        if (!files || files.length === 0) return;
        const f = files[0];
        // allow .csv, .xlsx, .xls
        const ok = /(csv|sheet|excel)/i.test(f.type) || /\.(csv|xlsx|xls)$/i.test(f.name);
        if (ok) setFile(f);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer?.files);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleImport = async () => {
        if (!file || submitting) return;
        const token = localStorage.getItem('token');
        const baseUrl = localStorage.getItem('baseUrl');
        if (!token || !baseUrl) {
            toast.error('Missing token or base URL');
            return;
        }
        try {
            setSubmitting(true);
            const formData = new FormData();
            // Align with service bulk upload field naming convention
            formData.append('pms_inventory_file', file);

            const res = await fetch(`https://${baseUrl}/pms/inventory/inventory_import.json`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            let data: any = null;
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                data = await res.json().catch(() => null);
            }

            if (!res.ok) {
                const msg = data?.message || 'Bulk upload failed';
                throw new Error(msg);
            }

            if (data?.import_errors?.length) {
                const first = data.import_errors[0];
                toast.error('Import completed with errors', {
                    description: first?.error ? `Row ${first?.row_number}: ${first.error}` : undefined,
                    duration: 10000,
                });
            } else {
                toast.success('Inventory bulk upload successful');
            }

            onImported?.();
            close();
        } catch (e: any) {
            console.error('Inventory bulk upload error:', e);
            toast.error(e?.message || 'Failed to import inventory');
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    const handleDownloadSample = () => {
        // Mirror the Rails ERB anchor: <a href="/assets/services.xlsx" download="services.xlsx" target="_blank" class="btn purple-btn2 btn-sm">...
        const baseUrl = localStorage.getItem('baseUrl');
        const href = baseUrl ? `https://${baseUrl}/assets/inventory.xlsx` : '/assets/inventory.xlsx';

        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'inventory.xlsx');
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        link.className = 'btn purple-btn2 btn-sm';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={close} />
            {/* Dialog */}
            <div className="relative z-10 w-[92%] max-w-lg rounded-lg bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button onClick={close} className="p-1 rounded hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {/* Body */}
                <div className="px-5 pb-5">
                    <div
                        className={`relative border-2 border-dashed rounded-md p-8 text-center transition-colors ${dragActive ? 'border-red-500 bg-red-50' : 'border-red-400/80'}`}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                    >
                        <Upload className="w-10 h-10 mx-auto mb-3 text-gray-500" />
                        <div className="text-gray-600">
                            <span>Drag & Drop or </span>
                            <button
                                type="button"
                                onClick={onChooseClick}
                                className="text-red-600 font-semibold underline underline-offset-2"
                            >
                                Choose File
                            </button>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                            Supports: CSV, Excel (.xlsx, .xls)
                        </div>
                        {file && (
                            <div className="mt-3 text-sm text-gray-700">
                                Selected: <span className="font-medium">{file.name}</span>
                            </div>
                        )}
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .xlsx, .xls"
                            className="hidden"
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                    </div>

                    {/* Footer actions */}
                    <div className="mt-6 flex items-center gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 border border-red-600 text-red-700 rounded-md hover:bg-red-50"
                            onClick={() => handleDownloadSample()}
                        >
                            Download Sample Format
                        </button>
                        <button
                            type="button"
                            disabled={!file || submitting}
                            onClick={handleImport}
                            className={`ml-auto px-4 py-2 rounded-md text-white ${!file || submitting ? 'bg-gray-200 cursor-not-allowed text-gray-500' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                            {submitting ? 'Importing…' : 'Import'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryBulkUploadDialog;
