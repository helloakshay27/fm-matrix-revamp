import React, { useState } from 'react';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface VisitorFilterDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: VisitorFilters) => void;
    onResetFilters: () => void;
}

export interface VisitorFilters {
    visitorName?: string;
    hostName?: string;
    purpose?: string;
    status?: string;
    personToMeet?: string;
    fromDate?: Date;
    toDate?: Date;
}

export const VisitorFilterDialog: React.FC<VisitorFilterDialogProps> = ({
    isOpen,
    onClose,
    onApplyFilters,
    onResetFilters,
}) => {
    const [filters, setFilters] = useState<VisitorFilters>({});

    const handleFilterChange = (key: keyof VisitorFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    const handleReset = () => {
        setFilters({});
        onResetFilters();
        onClose();
    };

    const handleClear = () => {
        setFilters({});
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
                    {/* Person To Meet */}
                    <div className="grid gap-2">
                        <Label>Person To Meet</Label>
                        <Select
                            value={filters.personToMeet || 'all'}
                            onValueChange={(value) => handleFilterChange('personToMeet', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger className="w-full bg-white border border-gray-300">
                                <SelectValue placeholder="Select Person To Meet" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                <SelectItem value="all">All Persons</SelectItem>
                                <SelectItem value="person1">Abdul Ghaffar</SelectItem>
                                <SelectItem value="person2">Arun</SelectItem>
                                <SelectItem value="person3">Aryan</SelectItem>
                                <SelectItem value="person4">Vinayak Mane</SelectItem>
                                <SelectItem value="person5">Sohail Ansari</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Visitor Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="visitorName">Visitor Name</Label>
                        <Input
                            id="visitorName"
                            placeholder="Enter visitor name"
                            value={filters.visitorName || ''}
                            onChange={(e) => handleFilterChange('visitorName', e.target.value)}
                        />
                    </div>

                    {/* Host Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="hostName">Host Name</Label>
                        <Input
                            id="hostName"
                            placeholder="Enter host name"
                            value={filters.hostName || ''}
                            onChange={(e) => handleFilterChange('hostName', e.target.value)}
                        />
                    </div>

                    {/* Purpose */}
                    <div className="grid gap-2">
                        <Label htmlFor="purpose">Purpose</Label>
                        <Input
                            id="purpose"
                            placeholder="Enter purpose"
                            value={filters.purpose || ''}
                            onChange={(e) => handleFilterChange('purpose', e.target.value)}
                        />
                    </div>

                    {/* Status */}
                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <Select
                            value={filters.status || 'all'}
                            onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
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

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>From Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !filters.fromDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filters.fromDate ? format(filters.fromDate, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filters.fromDate}
                                        onSelect={(date) => handleFilterChange('fromDate', date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="grid gap-2">
                            <Label>To Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !filters.toDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filters.toDate ? format(filters.toDate, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filters.toDate}
                                        onSelect={(date) => handleFilterChange('toDate', date)}
                                        initialFocus
                                        disabled={(date) =>
                                            filters.fromDate ? date < filters.fromDate : false
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={handleClear}>
                        Clear
                    </Button>
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
