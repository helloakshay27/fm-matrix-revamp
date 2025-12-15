import React from "react";
import { Button } from "@/components/ui/button";
import {
    X,
    UserCheck,
    CheckCircle,
} from "lucide-react";

interface InboundSelectionPanelProps {
    selectedCount: number;
    selectedItems: Array<{ id: number; name: string; status: string; delegate_id?: number | null }>;
    onDelegate: () => void;
    onCollect: () => void;
    onClearSelection: () => void;
}

export const InboundSelectionPanel: React.FC<InboundSelectionPanelProps> = ({
    selectedCount,
    selectedItems,
    onDelegate,
    onCollect,
    onClearSelection,
}) => {
    const getDisplayText = () => {
        if (selectedItems.length === 0) return "";
        if (selectedItems.length === 1) return selectedItems[0].name;
        if (selectedItems.length <= 3) {
            return selectedItems.map((item) => item.name).join(", ");
        }
        return (
            <>
                {selectedItems
                    .slice(0, 3)
                    .map((item) => item.name)
                    .join(", ")}{" "}
                and {selectedItems.length - 3} more
            </>
        );
    };

    // Check if all selected items meet the criteria
    const showDelegate = selectedItems.every(item =>
        ['received', 'overdue'].includes(item.status.toLowerCase()) && !item.delegate_id
    );

    const showCollect = selectedItems.every(item =>
        item.status.toLowerCase() !== 'collected'
    );

    return (
        <div
            className="fixed bg-white border border-gray-200 rounded-sm shadow-lg z-50"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "105px" }}
        >
            <div className="flex items-center justify-between w-full h-full pr-6">
                <div className="flex items-center gap-2">
                    <div className="text-[#C72030] bg-[#C4B89D] rounded-lg w-[44px] h-[105px] flex items-center justify-center text-xs font-bold">
                        {selectedCount}
                    </div>
                    <div className="flex flex-col justify-center px-3 py-2 flex-1">
                        <span className="text-[16px] font-semibold text-[#1A1A1A] whitespace-nowrap leading-none">
                            Selection
                        </span>
                        <span className="text-[12px] font-medium text-[#6B7280] break-words leading-tight max-w-[200px] truncate">
                            {getDisplayText()}
                        </span>
                    </div>
                </div>

                <div className="flex items-center ml-auto">
                    {showDelegate && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDelegate}
                            className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-2 h-auto mr-5"
                        >
                            <UserCheck className="w-6 h-6 mt-2" />
                            <span className="text-xs font-medium">Delegate</span>
                        </Button>
                    )}

                    {showCollect && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCollect}
                            className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-2 h-auto mr-5"
                        >
                            <CheckCircle className="w-6 h-6 mt-2" />
                            <span className="text-xs font-medium">Collect</span>
                        </Button>
                    )}

                    <div className="w-px h-8 bg-gray-300 mr-5"></div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClearSelection}
                        className="text-gray-600 hover:bg-gray-100"
                        style={{ width: "44px", height: "44px" }}
                    >
                        <X className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
