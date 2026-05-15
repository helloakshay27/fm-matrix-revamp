import React, { forwardRef } from 'react';
import { Dialog, DialogContent, Slide } from '@mui/material';
import { X, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { TransitionProps } from '@mui/material/transitions';

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

interface OpportunityFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: () => void;
    onReset: () => void;

    // Filter state
    selectedStatus: string[];
    setSelectedStatus: (statuses: string[]) => void;
    selectedResponsible: number[];
    setSelectedResponsible: (users: number[]) => void;
    selectedCreatedBy: number[];
    setSelectedCreatedBy: (creators: number[]) => void;
    selectedTags: any[];
    setSelectedTags: (tags: any[]) => void;
    dateRange: { startDate: string; endDate: string };
    setDateRange: (dates: { startDate: string; endDate: string }) => void;

    // Search terms
    searchTerms: {
        status: string;
        responsiblePerson: string;
        createdBy: string;
        tags: string;
    };
    setSearchTerms: (terms: any) => void;

    // Dropdown state
    dropdowns: {
        status: boolean;
        responsiblePerson: boolean;
        createdBy: boolean;
        tags: boolean;
        dateRange: boolean;
    };
    setDropdowns: (dropdowns: any) => void;

    // Data
    statusOptions: any[];
    users: any[];
    availableTags: any[];

    // Utilities
    renderCheckboxList: (options: any[], selected: any[], setSelected: Function, searchTerm?: string) => React.ReactNode;
    toggleDropdown: (key: string) => void;
}

const OpportunityFilterModal: React.FC<OpportunityFilterModalProps> = ({
    isOpen,
    onClose,
    onApply,
    onReset,
    selectedStatus,
    setSelectedStatus,
    selectedResponsible,
    setSelectedResponsible,
    selectedCreatedBy,
    setSelectedCreatedBy,
    selectedTags,
    setSelectedTags,
    dateRange,
    setDateRange,
    searchTerms,
    setSearchTerms,
    dropdowns,
    setDropdowns,
    statusOptions,
    users,
    availableTags,
    renderCheckboxList,
    toggleDropdown,
}) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth={false}
            TransitionComponent={Transition}
        >
            <DialogContent
                className="w-full max-w-sm fixed right-0 top-0 rounded-none bg-[#fff] text-sm overflow-y-auto h-full"
                style={{ margin: 0, maxHeight: "100vh", display: "flex", flexDirection: "column" }}
                sx={{
                    padding: "0 !important",
                    "& .MuiDialogContent-root": {
                        padding: "0 !important",
                        overflow: "auto",
                    }
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold">Filter</h2>
                    <X className="cursor-pointer" onClick={onClose} />
                </div>

                {/* Search Bar */}
                <div className="px-6 py-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-red-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter search..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                    </div>
                </div>

                {/* Filter Options */}
                <div className="flex-1 overflow-y-auto divide-y">
                    {/* Status */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown('status')}
                        >
                            <span className="font-medium text-sm select-none">Status</span>
                            {dropdowns.status ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.status && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter status..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={searchTerms.status}
                                        onChange={(e) => setSearchTerms({ ...searchTerms, status: e.target.value })}
                                    />
                                </div>
                                {renderCheckboxList(
                                    statusOptions,
                                    selectedStatus,
                                    setSelectedStatus,
                                    searchTerms.status
                                )}
                            </div>
                        )}
                    </div>

                    {/* Responsible Person */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown('responsiblePerson')}
                        >
                            <span className="font-medium text-sm select-none">Responsible Person</span>
                            {dropdowns.responsiblePerson ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.responsiblePerson && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter responsible person..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={searchTerms.responsiblePerson}
                                        onChange={(e) => setSearchTerms({ ...searchTerms, responsiblePerson: e.target.value })}
                                    />
                                </div>
                                {renderCheckboxList(
                                    users.map((u) => ({ ...u, label: u.full_name, value: u.id })),
                                    selectedResponsible,
                                    setSelectedResponsible,
                                    searchTerms.responsiblePerson
                                )}
                            </div>
                        )}
                    </div>

                    {/* Created By */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown('createdBy')}
                        >
                            <span className="font-medium text-sm select-none">Created By</span>
                            {dropdowns.createdBy ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.createdBy && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter created by..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={searchTerms.createdBy}
                                        onChange={(e) => setSearchTerms({ ...searchTerms, createdBy: e.target.value })}
                                    />
                                </div>
                                {renderCheckboxList(
                                    users.map((u) => ({ ...u, label: u.full_name, value: u.id })),
                                    selectedCreatedBy,
                                    setSelectedCreatedBy,
                                    searchTerms.createdBy
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown('tags')}
                        >
                            <span className="font-medium text-sm select-none">Tags</span>
                            {dropdowns.tags ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.tags && (
                            <div className="mt-4 border">
                                <div className="relative border-b">
                                    <Search className="absolute left-3 top-2.5 text-red-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter tags..."
                                        className="w-full pl-8 pr-4 py-2 text-sm border focus:outline-none"
                                        value={searchTerms.tags}
                                        onChange={(e) => setSearchTerms({ ...searchTerms, tags: e.target.value })}
                                    />
                                </div>
                                {renderCheckboxList(
                                    availableTags.map((tag: any) => ({
                                        label: tag.name || tag.label,
                                        value: tag.id,
                                    })),
                                    selectedTags,
                                    setSelectedTags,
                                    searchTerms.tags
                                )}
                            </div>
                        )}
                    </div>

                    {/* Created Date Range */}
                    <div className="p-6 py-3">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDropdown('dateRange')}
                        >
                            <span className="font-medium text-sm select-none">Created Date</span>
                            {dropdowns.dateRange ? (
                                <ChevronDown className="text-gray-400" />
                            ) : (
                                <ChevronRight className="text-gray-400" />
                            )}
                        </div>
                        {dropdowns.dateRange && (
                            <div className="mt-4 space-y-3">
                                <div>
                                    <label className="text-xs text-gray-600 font-medium">From</label>
                                    <input
                                        type="date"
                                        value={dateRange.startDate}
                                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                                        className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 font-medium">To</label>
                                    <input
                                        type="date"
                                        value={dateRange.endDate}
                                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                                        className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center items-center gap-4 px-6 py-3 border-t sticky bottom-0 bg-white">
                    <button
                        className="bg-[#C72030] text-white rounded px-10 py-2 text-sm font-semibold hover:bg-[#b71c1c]"
                        onClick={onApply}
                    >
                        Apply
                    </button>
                    <button
                        className="border border-[#C72030] text-[#C72030] rounded px-10 py-2 text-sm font-semibold hover:bg-red-50"
                        onClick={onReset}
                    >
                        Reset
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OpportunityFilterModal;
