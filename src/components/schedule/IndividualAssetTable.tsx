import React, { forwardRef, memo, useCallback, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

/**
 * Asset picker table for Add Schedule → Schedule Setup (Individual + Asset).
 * Sites can have thousands of assets, so only the rows in view are rendered
 * (spacer rows above/below keep the scroll height and the sticky header intact).
 */

const ROW_HEIGHT = 34;
const MAX_HEIGHT = 400;

const thStyle: React.CSSProperties = {
  padding: '9px 12px',
  textAlign: 'left',
  borderBottom: '1px solid #e0e0e0',
  fontWeight: 600,
  color: '#1a1a1a',
  backgroundColor: '#EDEAE3',
};

const tdStyle: React.CSSProperties = {
  padding: '7px 12px',
  borderBottom: '1px solid #f0f0f0',
  color: '#555',
};

const COLUMN_LABELS = ['Asset Name', 'Ext. Ref. ID', 'Group', 'Sub Group', 'Site', 'Building', 'Wing', 'Floor', 'Room'];

interface AssetRowProps {
  asset: any;
  index: number;
  isChecked: boolean;
  isLocked: boolean;
  onToggle: (id: string) => void;
}

// forwardRef so the virtualizer can measure real row height (long names may wrap).
const AssetRow = memo(forwardRef<HTMLTableRowElement, AssetRowProps>(({ asset, index, isChecked, isLocked, onToggle }, ref) => {
  const id = asset.id.toString();
  const loc = asset.location || {};
  return (
    <tr
      ref={ref}
      data-index={index}
      style={{
        backgroundColor: isChecked ? '#fff8f6' : index % 2 === 0 ? '#fff' : '#fafafa',
        cursor: isLocked ? 'default' : 'pointer',
        transition: 'background-color 0.1s',
      }}
      onClick={() => !isLocked && onToggle(id)}
    >
      {!isLocked && (
        <td style={{ ...tdStyle, textAlign: 'center' }}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => onToggle(id)}
            onClick={e => e.stopPropagation()}
            style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: 'var(--color-primary)' }}
          />
        </td>
      )}
      <td style={{ ...tdStyle, color: '#666' }}>{index + 1}</td>
      <td style={{ ...tdStyle, color: '#1a1a1a', fontWeight: isChecked ? 600 : 400 }}>{asset.name || '—'}</td>
      <td style={tdStyle}>{asset.ext_reference_id || '—'}</td>
      <td style={tdStyle}>{asset.asset_group || '—'}</td>
      <td style={tdStyle}>{asset.asset_sub_group || '—'}</td>
      <td style={tdStyle}>{loc.site || '—'}</td>
      <td style={tdStyle}>{loc.building || '—'}</td>
      <td style={tdStyle}>{loc.wing || '—'}</td>
      <td style={tdStyle}>{loc.floor || '—'}</td>
      <td style={tdStyle}>{loc.room || '—'}</td>
    </tr>
  );
}));
AssetRow.displayName = 'AssetRow';

interface IndividualAssetTableProps {
  /** Assets after the group / sub-group filters. */
  assets: any[];
  /** Size of the unfiltered list, to pick the right empty message. */
  totalCount: number;
  loading: boolean;
  isLocked: boolean;
  /** Selected asset ids (as strings). */
  selectedIds: string[];
  onSelectedIdsChange: (updater: (prev: string[]) => string[]) => void;
}

export const IndividualAssetTable: React.FC<IndividualAssetTableProps> = ({
  assets,
  totalCount,
  loading,
  isLocked,
  selectedIds,
  onSelectedIdsChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const colCount = isLocked ? 10 : 11;

  // O(1) lookups instead of Array.includes per row.
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allVisibleSelected = useMemo(
    () => assets.length > 0 && assets.every(a => selectedSet.has(a.id.toString())),
    [assets, selectedSet]
  );

  const virtualizer = useVirtualizer({
    count: loading ? 0 : assets.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const onToggle = useCallback(
    (id: string) =>
      onSelectedIdsChange(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])),
    [onSelectedIdsChange]
  );

  const onToggleAll = (checked: boolean) => {
    const visibleIds = assets.map(a => a.id.toString());
    if (checked) {
      onSelectedIdsChange(prev => Array.from(new Set([...prev, ...visibleIds])));
    } else {
      const removeSet = new Set(visibleIds);
      onSelectedIdsChange(prev => prev.filter(id => !removeSet.has(id)));
    }
  };

  const items = virtualizer.getVirtualItems();
  const paddingTop = items.length > 0 ? items[0].start : 0;
  const paddingBottom = items.length > 0 ? virtualizer.getTotalSize() - items[items.length - 1].end : 0;

  return (
    <div ref={scrollRef} style={{ border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'auto', maxHeight: MAX_HEIGHT }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Work Sans, sans-serif', fontSize: '13px', minWidth: '900px' }}>
        <thead>
          <tr style={{ backgroundColor: '#EDEAE3', position: 'sticky', top: 0, zIndex: 1 }}>
            {!isLocked && (
              <th style={{ ...thStyle, textAlign: 'center', width: '48px' }}>
                <input
                  type="checkbox"
                  title="Select all visible"
                  checked={allVisibleSelected}
                  onChange={e => onToggleAll(e.target.checked)}
                  style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                />
              </th>
            )}
            <th style={{ ...thStyle, width: '52px' }}>S.No.</th>
            {COLUMN_LABELS.map(label => (
              <th key={label} style={thStyle}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={colCount} style={{ padding: '16px', textAlign: 'center', color: '#888' }}>Loading assets...</td>
            </tr>
          ) : assets.length === 0 ? (
            <tr>
              <td colSpan={colCount} style={{ padding: '16px', textAlign: 'center', color: '#aaa' }}>
                {totalCount === 0 ? 'No assets found' : 'No assets match the selected filters'}
              </td>
            </tr>
          ) : (
            <>
              {paddingTop > 0 && (
                <tr aria-hidden style={{ height: paddingTop }}><td colSpan={colCount} style={{ padding: 0, border: 0 }} /></tr>
              )}
              {items.map(item => {
                const asset = assets[item.index];
                return (
                  <AssetRow
                    key={asset.id}
                    ref={virtualizer.measureElement}
                    asset={asset}
                    index={item.index}
                    isChecked={selectedSet.has(asset.id.toString())}
                    isLocked={isLocked}
                    onToggle={onToggle}
                  />
                );
              })}
              {paddingBottom > 0 && (
                <tr aria-hidden style={{ height: paddingBottom }}><td colSpan={colCount} style={{ padding: 0, border: 0 }} /></tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IndividualAssetTable;
