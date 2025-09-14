/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
} from "@tanstack/react-table";
import StatusBadge from "../Home/Projects/statusBadge";
import { useLocation } from "react-router-dom";
import Loader from "../Loader";
import SelectBox from "../SelectBox";
// --- Input Components for Inline Add Row ---
const InlineAddTextField = ({
    value,
    onChange,
    onEnterPress,
    inputRef,
    placeholder,
    className,
    validator,
}) => {
    const handleKeyDown = (event) => {
        if (event.key === "Enter" && onEnterPress) {
            event.preventDefault();
            onEnterPress();
        }
    };
    return (
        <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value || ""}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            className={`${validator ? "border border-red-500" : " border-none"
                } w-full p-1 h-full focus:outline-none rounded text-[13px] border border-gray-300 ${className || ""
                }`}
        />
    );
};

const InlineAddDateEditor = ({
    value,
    onChange,
    onEnterPress,
    placeholder,
    className,
    validator,
    min,
}) => {
    const handleKeyDown = (event) => {
        if (event.key === "Enter" && onEnterPress) {
            event.preventDefault();
            onEnterPress();
        }
    };
    return (
        <input
            type="date"
            min={min}
            placeholder={placeholder}
            value={value || ""}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            className={`${validator ? "border border-red-500" : " border-none"
                } w-full p-1 h-full focus:outline-none rounded text-[13px] border border-gray-300 ${className || ""
                }`}
        />
    );
};
// --- End Input Components ---

const globalStatusOptionsForInlineAdd = [
    "open",
    "in_progress",
    "completed",
    "on_hold",
];
const globalPriorityOptions = ["low", "medium", "high"];

const CustomTable = ({
    data,
    columns,
    fixedRowsPerPage = 10,
    rowHeight = 40, // This will apply to data rows and the inline add form
    headerHeight = 48,
    title,
    buttonText, // For the original header button
    onAdd, // For the original header button
    onCreateInlineItem,
    onRefreshInlineData,
    layout = "block",
    showDropdown = false,
    inlineAddButtonText = "+ Add Item Inline", // Text for the button at the bottom of the table
    loadingMessage = "",
    loading = false,
    users = null,
}) => {
    const location = useLocation();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: fixedRowsPerPage,
    });
    const [isAddingInlineItem, setIsAddingInlineItem] = useState(false);
    const [newInlineItemTitle, setNewInlineItemTitle] = useState("");
    const [newInlineItemStatus, setNewInlineItemStatus] = useState(
        globalStatusOptionsForInlineAdd[0]
    );
    const [newInlineItemStartDate, setNewInlineItemStartDate] = useState("");
    const [newInlineItemResponsibleId, setNewInlineItemResponsibleId] =
        useState("");
    const [newInlineItemPriority, setNewInlineItemPriority] = useState("");
    const [newInlineItemEndDate, setNewInlineItemEndDate] = useState("");
    const [inlineItemLocalError, setInlineItemLocalError] = useState(null);
    const [isSavingInlineItem, setIsSavingInlineItem] = useState(false);
    const [validator, setValidator] = useState(false);

    const newInlineItemTitleInputRef = useRef(null);
    const newInlineItemFormRowRef = useRef(null);

    const table = useReactTable({
        data,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: false,
    });

    const pageRows = table.getRowModel().rows;
    // Empty rows calculation ensures fixed table height for data area
    // The inline add form, if active, will visually take up one of these potential slots or add to scroll height
    const numEmptyRowsToAdd = Math.max(
        0,
        fixedRowsPerPage - pageRows.length - (isAddingInlineItem ? 1 : 0)
    );
    const desiredTableHeight = fixedRowsPerPage * rowHeight + headerHeight;
    const isInline = layout === "inline";

    const resetInlineItemForm = useCallback(() => {
        setNewInlineItemTitle("");
        setNewInlineItemStatus(globalStatusOptionsForInlineAdd[0]);
        setNewInlineItemStartDate("");
        setNewInlineItemEndDate("");
        setInlineItemLocalError(null);
        setValidator(false);
    }, []);

    const handleShowInlineItemForm = useCallback(() => {
        if (isAddingInlineItem || isSavingInlineItem) return;
        resetInlineItemForm();
        setIsAddingInlineItem(true);
    }, [resetInlineItemForm, isAddingInlineItem, isSavingInlineItem]);

    const handleCancelInlineItem = useCallback(() => {
        setIsAddingInlineItem(false);
        resetInlineItemForm();
    }, [resetInlineItemForm]);

    const handleSaveInlineItem = useCallback(async () => {
        if (
            !newInlineItemTitle ||
            newInlineItemTitle.trim() === "" ||
            !newInlineItemEndDate ||
            !newInlineItemStartDate
        ) {
            setInlineItemLocalError("Please fill out all required fields.");
            setValidator(true);
            if (newInlineItemTitleInputRef.current)
                newInlineItemTitleInputRef.current.focus();
            return;
        }
        if (typeof onCreateInlineItem !== "function") {
            setInlineItemLocalError(
                "Saving not configured. (onCreateInlineItem missing)"
            );
            return;
        }
        setInlineItemLocalError(null);
        setIsSavingInlineItem(true);
        setValidator(false);
        const newInlineItemData = {
            name: newInlineItemTitle.trim(),
            owner_id: newInlineItemResponsibleId,
            priority: newInlineItemPriority,
            status: newInlineItemStatus,
            start_date: newInlineItemStartDate || null,
            end_date: newInlineItemEndDate || null,
            project_id: 3,
        };
        try {
            await onCreateInlineItem(newInlineItemData);
            if (typeof onRefreshInlineData === "function") {
                await onRefreshInlineData();
            }
            handleCancelInlineItem();
        } catch (error) {
            setInlineItemLocalError(error.message || "Failed to save item.");
        } finally {
            setIsSavingInlineItem(false);
        }
    }, [
        newInlineItemTitle,
        newInlineItemStatus,
        newInlineItemStartDate,
        newInlineItemEndDate,
        onCreateInlineItem,
        onRefreshInlineData,
        handleCancelInlineItem,
        newInlineItemResponsibleId,
        newInlineItemPriority,
    ]);

    useEffect(() => {
        if (isAddingInlineItem && newInlineItemTitleInputRef.current) {
            newInlineItemTitleInputRef.current.focus();
        }
    }, [isAddingInlineItem]);

    useEffect(() => {
        const handleClickOutsideInlineForm = (event) => {
            if (
                !isAddingInlineItem ||
                isSavingInlineItem ||
                !newInlineItemFormRowRef.current ||
                newInlineItemFormRowRef.current.contains(event.target)
            ) {
                return;
            }

            handleSaveInlineItem();
        };
        if (isAddingInlineItem) {
            document.addEventListener("mousedown", handleClickOutsideInlineForm);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideInlineForm);
        };
    }, [
        isAddingInlineItem,
        isSavingInlineItem,
        newInlineItemTitle,
        handleSaveInlineItem,
        handleCancelInlineItem,
    ]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (!isAddingInlineItem) return;
            if (event.key === "Escape") {
                handleCancelInlineItem();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isAddingInlineItem, handleCancelInlineItem]);

    const tableColumns = table.getAllLeafColumns();
    const totalTableColumns = tableColumns.length;

    // Helper to get column width or a default if not available (e.g. for a new column)
    const getColWidth = (index) =>
        tableColumns[index]?.getSize() ?? (index < 4 ? 150 : 100);

    let content;
    if (loading) {
        content = <Loader message={loadingMessage} />;
    } else {
        content = (
            <>
                <div
                    className={`px-4 pl-7 ${!location.pathname.startsWith("/sprint-list") && "pt-4"
                        } ${isInline ? "flex justify-between items-center" : ""}`}
                >
                    <div
                        className={
                            isInline ? "" : "bg-[#bebfbf] px-3 py-1 rounded inline-block"
                        }
                    >
                        <h1 className="text-sm text-gray-800 flex items-center gap-1">
                            {title}
                        </h1>
                    </div>
                    {!isInline && <div className="border-b border-gray-200 mt-2"></div>}
                    {buttonText && onAdd && (
                        <div className={`${isInline ? "" : "flex justify-end mt-4 mr-3"}`}>
                            <button
                                className=" h-[38px] w-[170px] bg-[#C72030] text-white mr-5"
                                onClick={onAdd}
                                disabled={isAddingInlineItem || isSavingInlineItem}
                            >
                                <span className="mr-2">+</span>
                                <span className="text-[15px]">{buttonText}</span>
                                {/* <span className="ml-1 text-xs">▾</span> */}
                            </button>
                        </div>
                    )}
                </div>

                {inlineItemLocalError && isAddingInlineItem && (
                    <div className="px-4 pl-7 mt-2 mb-2">
                        <div className="p-2 text-sm text-red-700  rounded">
                            {inlineItemLocalError}
                        </div>
                    </div>
                )}

                <div className="project-table-container text-[14px] font-light px-4 mt-4">
                    <div
                        className="table-wrapper overflow-x-auto"
                        style={{ height: `${desiredTableHeight}px` }}
                    >
                        <table className="w-full">
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                style={{
                                                    width: header.column.getSize(),
                                                    height: `${headerHeight}px`,
                                                }} // Use header.column.getSize() for consistency
                                                className="bg-[#D5DBDB] px-3 py-3.5 text-center font-[500] border-r-2 border-[#FFFFFF66]"
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </div>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pageRows.map((row) => {
                                    /* ... existing data row mapping ... */
                                    const isDataRowEmpty =
                                        !row.original ||
                                        Object.values(row.original).every((v) => !v);
                                    return (
                                        <tr
                                            key={row.id}
                                            className={`hover:bg-gray-50 even:bg-[#D5DBDB4D]  ${isDataRowEmpty ? "pointer-events-none" : ""
                                                }`}
                                            style={{ height: `${rowHeight}px` }}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td
                                                    key={cell.id}
                                                    style={{ width: cell.column.getSize() }}
                                                    className={`${cell.column.columnDef.meta?.cellClassName || ""
                                                        } whitespace-nowrap px-3 py-3  ${isDataRowEmpty
                                                            ? "text-transparent"
                                                            : "text-gray-700"
                                                        }`}
                                                >
                                                    {!isDataRowEmpty ? (
                                                        flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )
                                                    ) : (
                                                        <span>&nbsp;</span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                                {isAddingInlineItem && (
                                    <tr
                                        ref={newInlineItemFormRowRef}
                                        style={{ height: `${rowHeight}px` }}
                                    >
                                        <td
                                            className="px-1 py-0 align-middle h-full"
                                            style={{ width: getColWidth(0) }}
                                        >
                                            &nbsp;
                                        </td>
                                        <td
                                            className="px-1 py-0 align-middle h-full"
                                            style={{ width: getColWidth(1) }}
                                        >
                                            <InlineAddTextField
                                                inputRef={newInlineItemTitleInputRef}
                                                value={newInlineItemTitle}
                                                onChange={(e) => {
                                                    setNewInlineItemTitle(e.target.value);
                                                    if (inlineItemLocalError)
                                                        setInlineItemLocalError(null);
                                                }}
                                                onEnterPress={handleSaveInlineItem}
                                                placeholder="Title"
                                                validator={validator}
                                            />
                                        </td>
                                        <td
                                            className="px-1 py-0 align-middle h-full"
                                            style={{ width: getColWidth(2) }}
                                        >
                                            <StatusBadge
                                                statusOptions={globalStatusOptionsForInlineAdd}
                                                status={newInlineItemStatus}
                                                onStatusChange={setNewInlineItemStatus}
                                            />
                                        </td>
                                        <td
                                            className="px-1 py-0 align-middle h-full"
                                            style={{ width: getColWidth(3) }}
                                        >
                                            <SelectBox
                                                table={true}
                                                options={users.map((user) => {
                                                    return {
                                                        label: user.firstname + " " + user.lastname,
                                                        value: user.id,
                                                    };
                                                })}
                                                value={newInlineItemResponsibleId}
                                                onChange={(selectedOptionValue) =>
                                                    setNewInlineItemResponsibleId(selectedOptionValue)
                                                }
                                            />
                                        </td>
                                        <td
                                            className="px-1 py-0 align-middle h-full"
                                            style={{ width: getColWidth(4) }}
                                        >
                                            <InlineAddDateEditor
                                                value={newInlineItemStartDate}
                                                min={new Date().toISOString().split("T")[0]}
                                                onChange={(e) =>
                                                    setNewInlineItemStartDate(e.target.value)
                                                }
                                                onEnterPress={handleSaveInlineItem}
                                                placeholder="Start Date"
                                                validator={validator}
                                            />
                                        </td>
                                        <td
                                            className="px-1 py-0 align-middle h-full"
                                            style={{ width: getColWidth(5) }}
                                        >
                                            <InlineAddDateEditor
                                                value={newInlineItemEndDate}
                                                min={newInlineItemStartDate}
                                                onChange={(e) =>
                                                    setNewInlineItemEndDate(e.target.value)
                                                }
                                                onEnterPress={handleSaveInlineItem}
                                                placeholder="End Date"
                                                validator={validator}
                                            />
                                        </td>
                                        <td
                                            className="px-1 py-0 align-middle h-full"
                                            style={{ width: getColWidth(6) }}
                                        ></td>
                                        <td
                                            className="px-1 py-0 align-middle h-full"
                                            style={{ width: getColWidth(7) }}
                                        >
                                            <StatusBadge
                                                statusOptions={globalPriorityOptions}
                                                status={newInlineItemPriority}
                                                onStatusChange={setNewInlineItemPriority}
                                            />
                                        </td>
                                        {/* <td className="px-1 py-0 align-middle h-full" style={{ width: getColWidth(8) }}>&nbsp;</td> */}

                                        {totalTableColumns > 8 &&
                                            tableColumns.slice(8).map((column, index) => (
                                                <td
                                                    key={`new-inline-extra-empty-${column.id}`}
                                                    className="px-1 py-0 align-middle h-full"
                                                    style={{ width: column.getSize() }}
                                                >
                                                    &nbsp;
                                                </td>
                                            ))}
                                    </tr>
                                )}

                                {Array.from({ length: numEmptyRowsToAdd }).map(
                                    (_, index /* ... existing empty row mapping ... */) => (
                                        <tr
                                            key={`empty-row-${index}`}
                                            style={{ height: `${rowHeight}px` }}
                                            className="even:bg-[#D5DBDB4D] pointer-events-none"
                                        >
                                            {tableColumns.map(
                                                (
                                                    column // Use tableColumns for consistency
                                                ) => (
                                                    <td
                                                        key={`empty-cell-${index}-${column.id}`}
                                                        style={{ width: column.getSize() }}
                                                        className="whitespace-nowrap px-3 py-2 text-transparent"
                                                    >
                                                        &nbsp;
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    )
                                )}

                                {/* Trigger for Inline Add - Placed at the end of tbody */}
                                {!isAddingInlineItem &&
                                    onCreateInlineItem && ( // Show only if inline add is configured
                                        <tr
                                            style={{ height: `${rowHeight}px` }}
                                            className="border-t border-gray-200"
                                        >
                                            <td colSpan={totalTableColumns} className="p-1 text-left">
                                                <button
                                                    onClick={handleShowInlineItemForm}
                                                    className="w-full text-left px-3 py-2 text-red-600 hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={isSavingInlineItem}
                                                >
                                                    + Add Sprint
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>

                    {data.length > 0 && (
                        <div className=" flex items-center justify-start gap-4 mt-4 text-[12px]">
                            {/* Previous Button */}
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="text-red-600 disabled:opacity-30"
                            >
                                {"<"}
                            </button>

                            {/* Page Numbers (Sliding Window of 3) */}
                            {(() => {
                                const totalPages = table.getPageCount();
                                const currentPage = table.getState().pagination.pageIndex;
                                const visiblePages = 3;

                                let start = Math.max(
                                    0,
                                    currentPage - Math.floor(visiblePages / 2)
                                );
                                let end = start + visiblePages;

                                // Ensure end does not exceed total pages
                                if (end > totalPages) {
                                    end = totalPages;
                                    start = Math.max(0, end - visiblePages);
                                }

                                return [...Array(end - start)].map((_, i) => {
                                    const page = start + i;
                                    const isActive = page === currentPage;

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => table.setPageIndex(page)}
                                            className={` px-3 py-1 ${isActive ? "bg-gray-200 font-bold" : ""
                                                }`}
                                        >
                                            {page + 1}
                                        </button>
                                    );
                                });
                            })()}

                            {/* Next Button */}
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="text-red-600 disabled:opacity-30"
                            >
                                {">"}
                            </button>
                        </div>
                    )}
                </div>
            </>
        );
    }
    return <div>{content}</div>;
};

export default CustomTable;
