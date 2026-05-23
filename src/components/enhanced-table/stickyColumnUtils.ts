/**
 * Utilities for calculating frozen/sticky column offsets
 * Used for managing left positioning in sticky table implementations
 */

import { ColumnConfig } from '@/hooks/useEnhancedTable';

/**
 * Calculate the cumulative left offset for a column at a given index
 * This is used to position frozen columns correctly with CSS position: sticky
 * 
 * @param columnIndex - The index of the column to calculate offset for
 * @param visibleColumns - Array of all visible columns
 * @param columnWidths - Record of column widths (key -> width in px)
 * @param defaultColumnWidth - Default width for columns without explicit width (default: 128px)
 * @returns The cumulative left offset in pixels
 */
export const calculateColumnLeftOffset = (
    columnIndex: number,
    visibleColumns: ColumnConfig[],
    columnWidths: Record<string, number>,
    defaultColumnWidth: number = 128
): number => {
    let offset = 0;

    // Sum up widths of all columns before this one
    for (let i = 0; i < columnIndex; i++) {
        const column = visibleColumns[i];
        offset += columnWidths[column.key] || defaultColumnWidth;
    }

    return offset;
};

/**
 * Get the width of a specific column
 * Falls back to default width if not found
 * 
 * @param columnKey - The key of the column
 * @param columnWidths - Record of column widths
 * @param defaultColumnWidth - Default width (default: 128px)
 * @returns The column width in pixels
 */
export const getColumnWidth = (
    columnKey: string,
    columnWidths: Record<string, number>,
    defaultColumnWidth: number = 128
): number => {
    return columnWidths[columnKey] || defaultColumnWidth;
};

/**
 * Calculate total width of all frozen columns
 * Useful for detecting horizontal scroll position or setting viewport widths
 * 
 * @param freezeColumnsCount - Number of columns to freeze
 * @param visibleColumns - Array of all visible columns
 * @param columnWidths - Record of column widths
 * @param defaultColumnWidth - Default width for columns
 * @returns Total width of frozen columns in pixels
 */
export const calculateFrozenColumnsWidth = (
    freezeColumnsCount: number,
    visibleColumns: ColumnConfig[],
    columnWidths: Record<string, number>,
    defaultColumnWidth: number = 128
): number => {
    let totalWidth = 0;

    for (let i = 0; i < Math.min(freezeColumnsCount, visibleColumns.length); i++) {
        const column = visibleColumns[i];
        totalWidth += getColumnWidth(column.key, columnWidths, defaultColumnWidth);
    }

    return totalWidth;
};

/**
 * Determine if a column at a given index should be frozen
 * 
 * @param columnIndex - The index to check
 * @param freezeColumnsCount - Number of columns to freeze
 * @returns Boolean indicating if column should be frozen
 */
export const isColumnFrozen = (
    columnIndex: number,
    freezeColumnsCount: number
): boolean => {
    return columnIndex < freezeColumnsCount;
};

/**
 * Get CSS class names for a frozen/sticky cell
 * 
 * @param columnIndex - The index of the column
 * @param freezeColumnsCount - Number of columns to freeze
 * @param leftOffset - The left offset in pixels
 * @returns CSS class string for the cell
 */
export const getFrozenCellClasses = (
    columnIndex: number,
    freezeColumnsCount: number,
    leftOffset?: number
): Record<string, any> => {
    const isFrozen = isColumnFrozen(columnIndex, freezeColumnsCount);

    return {
        isFrozen,
        isLastFrozen: isFrozen && columnIndex === freezeColumnsCount - 1,
        hasLeftOffset: leftOffset !== undefined && leftOffset > 0,
    };
};

/**
 * Get inline styles for a frozen/sticky cell
 * Combines both sticky header and column positioning
 * 
 * @param columnIndex - The index of the column
 * @param freezeColumnsCount - Number of columns to freeze
 * @param leftOffset - The left offset in pixels
 * @param isStickyHeader - Whether this is a header cell
 * @param baseZIndex - Base z-index for frozen cells (default: 10)
 * @returns Inline style object
 */
export const getFrozenCellStyles = (
    columnIndex: number,
    freezeColumnsCount: number,
    leftOffset: number = 0,
    isStickyHeader: boolean = false,
    baseZIndex: number = 10
): React.CSSProperties => {
    const isFrozen = isColumnFrozen(columnIndex, freezeColumnsCount);

    if (!isFrozen) {
        return {};
    }

    const styles: React.CSSProperties = {
        position: 'sticky',
        left: `${leftOffset}px`,
        // Z-index hierarchy:
        // - Frozen header cells: baseZIndex + 1 (to appear above frozen body cells)
        // - Frozen body cells: baseZIndex
        // - Normal cells: auto
        zIndex: isStickyHeader ? baseZIndex + 1 : baseZIndex,
        backgroundColor: 'inherit', // Inherit from the cell's natural background
    };

    return styles;
};

/**
 * Configuration object for sticky column rendering
 * Contains all necessary information to render a frozen column correctly
 */
export interface FrozenColumnConfig {
    isFrozen: boolean;
    isLastFrozen: boolean;
    leftOffset: number;
    zIndex: number;
    showShadow: boolean;
}

/**
 * Generate frozen column configuration for a specific cell
 * 
 * @param columnIndex - The index of the column
 * @param freezeColumnsCount - Number of columns to freeze
 * @param visibleColumns - Array of all visible columns
 * @param columnWidths - Record of column widths
 * @param isStickyHeader - Whether this is a header cell
 * @param baseZIndex - Base z-index value
 * @returns FrozenColumnConfig object with all styling information
 */
export const getFrozenColumnConfig = (
    columnIndex: number,
    freezeColumnsCount: number,
    visibleColumns: ColumnConfig[],
    columnWidths: Record<string, number>,
    isStickyHeader: boolean = false,
    baseZIndex: number = 10
): FrozenColumnConfig => {
    const isFrozen = isColumnFrozen(columnIndex, freezeColumnsCount);

    if (!isFrozen) {
        return {
            isFrozen: false,
            isLastFrozen: false,
            leftOffset: 0,
            zIndex: 0,
            showShadow: false,
        };
    }

    const leftOffset = calculateColumnLeftOffset(
        columnIndex,
        visibleColumns,
        columnWidths
    );

    return {
        isFrozen: true,
        isLastFrozen: columnIndex === freezeColumnsCount - 1,
        leftOffset,
        zIndex: isStickyHeader ? baseZIndex + 1 : baseZIndex,
        showShadow: columnIndex === freezeColumnsCount - 1,
    };
};
