import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Plus } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from '@/components/ui/pagination';


const SacHsn = () => {

    const [showActionPanel, setShowActionPanel] = React.useState(false);
    const navigate = useNavigate();

    const handleAddClick = useCallback(() => navigate('/settings/inventory-management/sac-hsn-code/add'), [navigate])

    const handleActionClick = useCallback(() => {
        setShowActionPanel(true);
    }, []);


    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searching, setSearching] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [paginationData, setPaginationData] = useState<{ current_page: number; total_pages: number; total_count: number; next_page: number | null; prev_page: number | null }>({ current_page: 1, total_pages: 1, total_count: 0, next_page: null, prev_page: null });
    const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');

    // initial sample row kept as fallback until API responds
    const initialSample = [
        {
            id: 1,
            hsn_type: 'Product',
            category: 'test category',
            code: 'jgg55b',
            cgst_rate: '11.0%',
            sgst_rate: '11.0%',
            igst_rate: '13.0%',
            created_by: 'John Doe',
            created_at: '2023-06-04',
            updated_at: '2023-06-04',
        },
    ];

    useEffect(() => {
        const fetchHsns = async (page: number = 1) => {
            setLoading(true);
            setError(null);
            if (currentSearchTerm) setSearching(true);
            try {
                const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                const token = localStorage.getItem('token');
                const url = `https://${baseUrl}/pms/hsns.json`;
                const resp = await axios.get(url, {
                    params: {
                        ...(page ? { page } : {}),
                        ...(currentSearchTerm ? { 'q[category_cont]': currentSearchTerm } : {}),
                    },
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                // API may return { pms_hsns: [...] } or array directly
                const payload = resp.data;
                let items: any[] = [];
                if (!payload) items = [];
                else if (Array.isArray(payload)) items = payload;
                else if (Array.isArray(payload.pms_hsns)) items = payload.pms_hsns;
                else if (Array.isArray(payload.pms_hsn)) items = payload.pms_hsn;
                else items = [];

                // Set pagination info if backend provides it
                if (payload?.meta) {
                    setPaginationData({
                        current_page: payload.meta.current_page || 1,
                        total_pages: payload.meta.total_pages || 1,
                        total_count: payload.meta.total_count || items.length,
                        next_page: payload.meta.next_page ?? null,
                        prev_page: payload.meta.prev_page ?? null,
                    });
                }

                if (items.length === 0) {
                    // use sample
                    setData(initialSample);
                } else {
                    setData(items);
                }
            } catch (err: any) {
                setError(err?.message || 'Failed to fetch HSN data');
                setData(initialSample);
            } finally {
                setLoading(false);
                setSearching(false);
            }
        };

        fetchHsns(currentPage);
    }, [currentPage, currentSearchTerm]);

    // Server-side search handler: query by category (q[category_cont])
    const handleGlobalSearch = (term: string, page: number = 1) => {
        // update search term and reset to requested page (usually 1)
        setCurrentSearchTerm(term);
        setCurrentPage(page);
    };

    const columns = [
        { key: 'actions', label: 'Action', sortable: false },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'category', label: 'Category', sortable: true },
        { key: 'code', label: 'SAC/HSN Code', sortable: true },
        { key: 'cgst', label: 'CGST Rate', sortable: true },
        { key: 'sgst', label: 'SGST Rate', sortable: true },
        { key: 'igst', label: 'IGST Rate', sortable: true },
        { key: 'createdBy', label: 'Created By', sortable: true },
        { key: 'createdOn', label: 'Created On', sortable: true },
        { key: 'updatedOn', label: 'Updated On', sortable: true },
    ];

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case 'actions':
                return (
                    <div className="flex items-center justify-center">
                        <Eye
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => navigate(`/settings/inventory-management/sac-hsn-code/${item.id}`)}
                        />
                    </div>
                );
            case 'type':
                return item.hsn_type || item.type || '-';
            case 'category':
                return item.category || item.category_name || '-';
            case 'code':
                return item.code || item.hsn_code || '-';
            case 'cgst':
                return item.cgst_rate || item.cgst || '-';
            case 'sgst':
                return item.sgst_rate || item.sgst || '-';
            case 'igst':
                return item.igst_rate || item.igst || '-';
            case 'createdBy':
                return item.created_by || item.createdBy || '-';
            case 'createdOn':
                // API sometimes returns a raw created_on string in custom format (e.g. "08/06/2023  2:01 AM").
                // Avoid new Date(...) on ambiguous formats; prefer showing the raw value when present.
                return item.created_on?.trim() || (item.createdOn ? new Date(item.createdOn).toLocaleString('en-GB') : '-') || '-';
            case 'updatedOn':
                return item.updated_on?.trim() || (item.updatedOn ? new Date(item.updatedOn).toLocaleString('en-GB') : '-') || '-';
            default:
                return '-';
        }

    };

    const leftActions = (
        <div className="flex flex-wrap gap-3">
            <Button onClick={handleActionClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4" /> Action
            </Button>
        </div>
    );

    const paginationItems = React.useMemo(() => {
        const items: React.ReactNode[] = [];
        const totalPages = paginationData.total_pages;
        const current = paginationData.current_page;
        const showEllipsis = totalPages > 7;

        if (showEllipsis) {
            // Always show first page
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink className='cursor-pointer' onClick={() => setCurrentPage(1)} isActive={current === 1}>
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            // Show pages 2,3,4 if current is small
            if (current <= 3) {
                for (let i = 2; i <= 4 && i < totalPages; i++) {
                    items.push(
                        <PaginationItem key={i}>
                            <PaginationLink className='cursor-pointer' onClick={() => setCurrentPage(i)} isActive={current === i}>
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    );
                }
                if (totalPages > 5) {
                    items.push(
                        <PaginationItem key="ellipsis1">
                            <PaginationEllipsis />
                        </PaginationItem>
                    );
                }
            } else if (current >= totalPages - 2) {
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
                for (let i = totalPages - 3; i < totalPages; i++) {
                    if (i > 1) {
                        items.push(
                            <PaginationItem key={i}>
                                <PaginationLink className='cursor-pointer' onClick={() => setCurrentPage(i)} isActive={current === i}>
                                    {i}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }
                }
            } else {
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
                for (let i = current - 1; i <= current + 1; i++) {
                    items.push(
                        <PaginationItem key={i}>
                            <PaginationLink className='cursor-pointer' onClick={() => setCurrentPage(i)} isActive={current === i}>
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    );
                }
                items.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            if (totalPages > 1) {
                items.push(
                    <PaginationItem key={totalPages}>
                        <PaginationLink className='cursor-pointer' onClick={() => setCurrentPage(totalPages)} isActive={current === totalPages}>
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink className='cursor-pointer' onClick={() => setCurrentPage(i)} isActive={current === i}>
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }
        return items;
    }, [paginationData]);

    return (
        <div className="p-4 sm:p-6">
            {showActionPanel && (
                <SelectionPanel
                    onAdd={handleAddClick}
                    onClearSelection={() => setShowActionPanel(false)}
                />
            )}

            <EnhancedTable
                data={data}
                columns={columns}
                renderCell={renderCell}
                pagination={false}
                selectable={false}
                storageKey="sac-hsn-table"
                className=""
                leftActions={leftActions}
                loading={loading || searching}
                enableSearch={true}
                enableGlobalSearch={true}
                onGlobalSearch={(term: string) => handleGlobalSearch(term, 1)}
                searchPlaceholder="Search category..."
            />
            {!loading && (
                <div className="flex justify-center mt-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(Math.max(1, paginationData.current_page - 1))}
                                    className={paginationData.current_page === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>

                            {paginationItems}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(Math.min(paginationData.total_pages, paginationData.current_page + 1))}
                                    className={paginationData.current_page === paginationData.total_pages ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default SacHsn;