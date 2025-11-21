import React, { useRef, useEffect, useState } from 'react';

interface StatusOption {
    value: string;
    label: string;
    color: string;
}

interface StatusDropdownProps {
    data: any;
    selectedStatus: { [key: string]: string };
    onStatusChange: (newStatus: string, id: number) => void;
    openDropdownId: number | null;
    setOpenDropdownId: (id: number | null) => void;
    statusOptions: StatusOption[];
    getStatusStyle: (status: string) => React.CSSProperties;
    readOnly?: boolean;
    show?: boolean;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
    data,
    selectedStatus,
    onStatusChange,
    openDropdownId,
    setOpenDropdownId,
    statusOptions,
    getStatusStyle,
    readOnly = false,
    show = true
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    if (!show) return null;

    // Get current status value (API format like 'scheduled', 'in_progress')
    const currentStatus = selectedStatus[data.id] || data.status.toLowerCase().replace(/\s+/g, '_');

    // Find the matching status option
    const statusOption = statusOptions.find(
        (status) => status.value.toLowerCase() === currentStatus.toLowerCase()
    );

    const statusLabel = statusOption?.label || data.status;

    // Update dropdown position when opened
    useEffect(() => {
        if (openDropdownId === data.id && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX
            });
        }
    }, [openDropdownId, data.id]);

    // ✅ If readOnly, just render a styled disabled select
    if (readOnly) {
        return (
            <select
                className="form-select"
                value={currentStatus}
                disabled
                style={{
                    ...getStatusStyle(currentStatus),
                    cursor: 'not-allowed',
                    opacity: 0.8
                }}
            >
                <option value={currentStatus}>{statusLabel}</option>
            </select>
        );
    }

    console.log(openDropdownId, data.id)

    // ✅ Full interactive dropdown
    return (
        <>
            <div className="relative w-full">
                <button
                    ref={buttonRef}
                    className={`w-full px-4 py-2 rounded-md flex items-center justify-between transition-all ${openDropdownId === data.id ? 'ring-2 ring-offset-1 ring-gray-300' : ''
                        }`}
                    style={getStatusStyle(currentStatus)}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === data.id ? null : data.id);
                    }}
                >
                    <span className="font-medium">{statusLabel}</span>
                    <svg
                        className={`w-4 h-4 transition-transform ${openDropdownId === data.id ? 'rotate-180' : ''
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
            </div>

            {openDropdownId === data.id && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[9998]"
                        onClick={() => setOpenDropdownId(null)}
                    />

                    {/* Dropdown Menu - Fixed positioning */}
                    <div
                        className="fixed bg-white rounded-md shadow-xl border border-gray-200 z-[9999] flex flex-col overflow-hidden min-w-[140px]"
                        style={{
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`,
                        }}
                    >
                        {statusOptions.map((status) => (
                            <button
                                key={status.value}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStatusChange(status.value, data.id);
                                    setOpenDropdownId(null);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:opacity-90 transition-opacity font-medium whitespace-nowrap"
                                style={getStatusStyle(status.value)}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default StatusDropdown;
