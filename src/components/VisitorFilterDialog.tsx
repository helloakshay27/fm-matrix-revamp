import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { useToast } from '@/hooks/use-toast';

interface VisitorFilterDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: VisitorFilters) => void;
    onResetFilters: () => void;
    currentFilters?: VisitorFilters;
}

export interface VisitorFilters {
    visitorName?: string;   // q[guest_name_cont]
    hostId?: string;        // host_id (person to meet)
    purpose?: string;       // q[visit_purpose_cont]
    visitorType?: string;   // visitor_type: 'Expected' | 'Unexpected'
    status?: string;        // status
}

export const VisitorFilterDialog: React.FC<VisitorFilterDialogProps> = ({
    isOpen,
    onClose,
    onApplyFilters,
    onResetFilters,
    currentFilters = {},
}) => {
    const { toast } = useToast();
    const [filters, setFilters] = useState<VisitorFilters>(currentFilters);
    const [fmUsers, setFmUsers] = useState<{ id: number; name: string }[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    useEffect(() => {
        setFilters(currentFilters);
    }, [currentFilters]);

    useEffect(() => {
        if (isOpen) {
            fetchFMUsers();
        }
    }, [isOpen]);

    const fetchFMUsers = async () => {
        setLoadingUsers(true);
        try {
            const users = await ticketManagementAPI.getFMUsers();
            setFmUsers(users);
        } catch (error) {
            console.error('Error fetching FM users:', error);
            toast({
                title: "Error",
                description: "Failed to fetch users. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleFilterChange = (key: keyof VisitorFilters, value: string | undefined) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    const handleReset = () => {
        setFilters({});
        onResetFilters();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <DialogTitle className="text-lg font-semibold">Filter Visitors</DialogTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-6 w-6 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Visitor Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="visitorName">Visitor Name</Label>
                        <Input
                            id="visitorName"
                            placeholder="Enter visitor name"
                            value={filters.visitorName || ''}
                            onChange={(e) => handleFilterChange('visitorName', e.target.value || undefined)}
                        />
                    </div>

                    {/* Person To Meet (Host) */}
                    <div className="grid gap-2">
                        <Label>Host</Label>
                        <Select
                            value={filters.hostId || 'all'}
                            onValueChange={(value) => handleFilterChange('hostId', value === 'all' ? undefined : value)}
                            disabled={loadingUsers}
                        >
                            <SelectTrigger className="w-full bg-white border border-gray-300">
                                <SelectValue placeholder={loadingUsers ? "Loading users..." : "Select Person To Meet"} />
                            </SelectTrigger>
                            <SelectContent
                                className="bg-white border border-gray-200 shadow-lg z-[9999] max-h-[200px] overflow-y-auto"
                                position="popper"
                                side="bottom"
                                align="start"
                                sideOffset={8}
                                avoidCollisions={false}
                                sticky="always"
                            >
                                <SelectItem value="all">All Persons</SelectItem>
                                {loadingUsers ? (
                                    <SelectItem value="loading" disabled className="text-gray-400">
                                        Loading users...
                                    </SelectItem>
                                ) : fmUsers.length > 0 ? (
                                    fmUsers.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="no-users" disabled className="text-gray-400">
                                        No users available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Purpose */}
                    <div className="grid gap-2">
                        <Label htmlFor="purpose">Purpose</Label>
                        <Input
                            id="purpose"
                            placeholder="Enter purpose"
                            value={filters.purpose || ''}
                            onChange={(e) => handleFilterChange('purpose', e.target.value || undefined)}
                        />
                    </div>

                    {/* Visitor Type */}
                    <div className="grid gap-2">
                        <Label>Visitor Type</Label>
                        <Select
                            value={filters.visitorType || 'all'}
                            onValueChange={(value) => handleFilterChange('visitorType', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger className="w-full bg-white border border-gray-300">
                                <SelectValue placeholder="Select visitor type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg z-[9999]">
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Expected">Expected</SelectItem>
                                <SelectItem value="Unexpected">Unexpected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <Select
                            value={filters.status || 'all'}
                            onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger className="w-full bg-white border border-gray-300">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg z-[9999]">
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                                <SelectItem value="Expected">Expected</SelectItem>
                                <SelectItem value="Checked In">Checked In</SelectItem>
                                <SelectItem value="Checked Out">Checked Out</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={handleReset}>
                        Reset
                    </Button>
                    <Button
                        onClick={handleApply}
                        className="bg-[#C72030] hover:bg-[#A01B28] text-white"
                    >
                        Apply Filters
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
