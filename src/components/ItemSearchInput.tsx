import React from 'react';
import { createPortal } from 'react-dom';

interface ItemOption {
    id: string | number;
    name: string;
    rate?: number;
    description?: string;
    tax_preference?: string;
    tax_exemption_id?: number | null;
    tax_group_id?: number | null;
    inter_state_tax_rate_id?: any;
}

interface ItemSearchInputProps {
    value: string;
    itemOptions: ItemOption[];
    onSelect: (item: ItemOption) => void;
    onType: (text: string) => void;
}

const ItemSearchInput: React.FC<ItemSearchInputProps> = ({ value, itemOptions, onSelect, onType }) => {
    const [inputVal, setInputVal] = React.useState(value);
    const [open, setOpen] = React.useState(false);
    const [dropdownPos, setDropdownPos] = React.useState({ top: 0, left: 0, width: 0 });
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => { setInputVal(value); }, [value]);

    const filtered = itemOptions.filter(o =>
        o?.name?.toLowerCase().includes(inputVal.toLowerCase())
    );

    const handleSelect = (opt: ItemOption) => {
        setInputVal(opt.name);
        setOpen(false);
        onSelect(opt);
    };

    const openDropdown = () => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + window.scrollY + 2,
                left: rect.left + window.scrollX,
                width: Math.max(rect.width, 280),
            });
        }
        setOpen(true);
    };

    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            const dropdown = document.getElementById('item-search-dropdown');
            if (
                inputRef.current && !inputRef.current.contains(target) &&
                (!dropdown || !dropdown.contains(target))
            ) {
                setOpen(false);
                onType(inputVal);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [inputVal]);

    return (
        <div style={{ position: 'relative', minWidth: 250 }}>
            <input
                ref={inputRef}
                type="text"
                value={inputVal}
                placeholder="Type or select item"
                onFocus={openDropdown}
                onChange={(e) => {
                    setInputVal(e.target.value);
                    openDropdown();
                }}
                onBlur={() => onType(inputVal)}
                style={{
                    width: '100%',
                    padding: '6px 10px',
                    fontSize: 13,
                    border: '1px solid #d1d5db',
                    borderRadius: 4,
                    outline: 'none',
                    background: '#fff',
                    boxSizing: 'border-box',
                    height: 34,
                }}
                onFocusCapture={(e) => (e.target.style.borderColor = '#C72030')}
                onBlurCapture={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
            {open && typeof document !== 'undefined' && createPortal(
                <div
                    id="item-search-dropdown"
                    style={{
                        position: 'absolute',
                        top: dropdownPos.top,
                        left: dropdownPos.left,
                        width: dropdownPos.width,
                        zIndex: 9999,
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        maxHeight: 240,
                        overflowY: 'auto',
                    }}
                >
                    {filtered.length === 0 ? (
                        <div style={{ padding: '10px 14px', fontSize: 13, color: '#6b7280' }}>
                            No results found. Try a different keyword.
                        </div>
                    ) : (
                        filtered.map((opt) => (
                            <div
                                key={opt.id}
                                onMouseDown={(e) => { e.preventDefault(); handleSelect(opt); }}
                                style={{
                                    padding: '8px 14px',
                                    fontSize: 13,
                                    cursor: 'pointer',
                                    color: '#111827',
                                    borderBottom: '1px solid #f3f4f6',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                            >
                                {opt.name}
                            </div>
                        ))
                    )}
                    {/* {inputVal.trim() && !filtered.find(o => o.name.toLowerCase() === inputVal.trim().toLowerCase()) && (
                        <div
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onType(inputVal.trim());
                                setOpen(false);
                            }}
                            style={{
                                padding: '8px 14px',
                                fontSize: 13,
                                color: '#C72030',
                                cursor: 'pointer',
                                fontWeight: 500,
                                borderTop: '1px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                        >
                            + Add New Item: "{inputVal.trim()}"
                        </div>
                    )} */}
                </div>,
                document.body
            )}
        </div>
    );
};

export default ItemSearchInput;
