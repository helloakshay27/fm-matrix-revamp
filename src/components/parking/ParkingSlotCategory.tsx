import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { SlotType } from './parkingSlotUtils';

interface ParkingSlotCategoryProps {
  title: string;
  type: SlotType;
  /** Actual slot names, one per physical slot (stack: A and B are separate entries). */
  slots: string[];
  isStack?: boolean;
  onResize: (type: SlotType, targetLength: number) => void;
  onRemove: (type: SlotType, index: number) => void;
  onRename: (type: SlotType, index: number, name: string) => void;
}

// Shared by the Add and Edit slot-configuration pages. Defined at module scope so its identity
// stays stable across re-renders — otherwise every keystroke would remount the slot grid and
// lose scroll/focus.
export const ParkingSlotCategory: React.FC<ParkingSlotCategoryProps> = ({
  title,
  type,
  slots,
  isStack = false,
  onResize,
  onRemove,
  onRename,
}) => {
  // Stack is entered in pairs; the other types are entered as plain counts.
  const displayCount = isStack ? slots.length / 2 : slots.length;

  // Local, uncommitted value — typing here must NOT touch the slot list until "Add" is clicked.
  const [draftCount, setDraftCount] = useState(String(displayCount));

  useEffect(() => {
    setDraftCount(String(displayCount));
  }, [displayCount]);

  const handleAddClick = () => {
    const parsed = Math.max(0, parseFloat(draftCount) || 0);
    onResize(type, isStack ? Math.round(parsed * 2) : Math.floor(parsed));
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosRef.current;
    }
  });

  return (
    <div>
      <h4 className="font-medium mb-4">{title}</h4>
      <div
        ref={scrollRef}
        onScroll={(e) => {
          scrollPosRef.current = e.currentTarget.scrollTop;
        }}
        className="bg-white rounded-lg p-4 mb-4 h-[200px] border-2 border-dashed border-gray-200 overflow-y-auto"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {slots.map((name, index) => (
            <div key={index} className="relative">
              <Input
                value={name}
                onChange={(e) => onRename(type, index, e.target.value)}
                className="w-full h-10 text-xs text-center bg-white border-gray-300 rounded-lg font-medium"
                placeholder="Slot name"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 text-xs border-2 border-white"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onRemove(type, index);
                }}
              >
                &#x2715;
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={draftCount}
          onChange={(e) => setDraftCount(e.target.value)}
          className="w-16 h-8 text-center"
          min="0"
          step={isStack ? '0.5' : '1'}
        />
        <Button size="sm" className="fm-button-fix fm-button-brand px-4 py-2" variant="ghost" onClick={handleAddClick}>
          Add
        </Button>
        <span className="text-sm font-medium text-gray-600">Total: {slots.length}</span>
      </div>
    </div>
  );
};
