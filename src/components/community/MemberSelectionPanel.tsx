import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

interface Member {
    id: string;
    name: string;
}

interface MemberSelectionPanelProps {
    selectedCount: number;
    selectedMembers: Member[];
    selectedMemberIds: string[];
    onDeleteMembers: () => void;
    onClearSelection: () => void;
}

export const MemberSelectionPanel: React.FC<MemberSelectionPanelProps> = ({
    selectedCount,
    selectedMembers,
    selectedMemberIds,
    onDeleteMembers,
    onClearSelection,
}) => {
    const [showAll, setShowAll] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleClearClick = () => {
        console.log("X button clicked - clearing selection");
        onClearSelection();
    };

    const handleDeleteClick = async () => {
        if (selectedMembers.length === 0) {
            toast.error("No members selected for deletion.");
            return;
        }

        setIsDeleting(true);
        try {
            await onDeleteMembers();
            onClearSelection();
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const getDisplayText = () => {
        if (selectedMembers.length === 0) return "";
        if (selectedMembers.length === 1) return selectedMembers[0].name;
        if (showAll) {
            return selectedMembers.map((member) => member.name).join(", ");
        }
        if (selectedMembers.length <= 6) {
            return selectedMembers.map((member) => member.name).join(", ");
        }
        return (
            <>
                {selectedMembers
                    .slice(0, 6)
                    .map((member) => member.name)
                    .join(", ")}{" "}
                and{" "}
                <button
                    onClick={() => setShowAll(true)}
                    className="text-blue-600 hover:text-blue-800 underline"
                >
                    {selectedMembers.length - 6} more
                </button>
            </>
        );
    };

    // If we have selected IDs but no objects, show generic text
    const safeGetDisplayText = () => {
        if (selectedCount > 0 && selectedMembers.length === 0) {
            return `${selectedCount} member(s) selected`;
        }
        return getDisplayText();
    };

    return (
        <div
            className="fixed bg-white border border-gray-200 rounded-sm shadow-lg z-50"
            style={{ top: "50%", left: "35%", width: "563px", height: "105px" }}
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
                        <span className="text-[12px] font-medium text-[#6B7280] break-words leading-tight">
                            {safeGetDisplayText()}
                        </span>
                    </div>
                </div>

                <div className="flex items-center ml-10">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                        className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-2 h-auto mr-5 disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-6 h-6 mt-4 animate-spin" />
                        ) : (
                            <svg
                                className="w-5 h-5 mt-4"
                                viewBox="0 0 16 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5.4039 13.8926L8.0039 11.3412L10.6039 13.8926L12.0039 12.5187L9.4039 9.96733L12.0039 7.41593L10.6039 6.04209L8.0039 8.5935L5.4039 6.04209L4.0039 7.41593L6.6039 9.96733L4.0039 12.5187L5.4039 13.8926ZM3.0039 18.3084C2.45391 18.3084 1.98307 18.1163 1.59141 17.7319C1.19974 17.3476 1.00391 16.8856 1.00391 16.3458V3.58882H0.00390625V1.62621H5.0039V0.644897H11.0039V1.62621H16.0039V3.58882H15.0039V16.3458C15.0039 16.8856 14.8081 17.3476 14.4164 17.7319C14.0247 18.1163 13.5539 18.3084 13.0039 18.3084H3.0039ZM13.0039 3.58882H3.0039V16.3458H13.0039V3.58882Z"
                                    fill="#1C1B1F"
                                />
                            </svg>
                        )}
                        <span className="text-xs font-medium">Remove Member</span>
                    </Button>

                    <div className="w-px h-8 bg-gray-300 mr-5"></div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClearClick}
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
