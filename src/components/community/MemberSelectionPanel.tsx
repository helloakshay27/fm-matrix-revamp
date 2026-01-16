import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleClearClick = () => {
        console.log("X button clicked - clearing selection");
        onClearSelection();
    };

    const handleDeleteClick = () => {
        if (selectedMembers.length === 0) {
            toast.error("No members selected for deletion.");
            return;
        }
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await onDeleteMembers();
            onClearSelection();
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
            setIsDialogOpen(false);
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
                        className="text-gray-600  flex flex-col items-center gap-2 h-auto mr-5 disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-6 h-6 mt-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-5 h-5" />
                        )}
                        <span className="text-xs font-medium">Remove</span>
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

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure want to remove the members?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-[#C72030] hover:bg-[#A61B28]">
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
