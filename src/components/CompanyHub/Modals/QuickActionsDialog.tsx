import React from "react";
import { X, CheckSquare, AlertCircle, ListTodo, PenTool } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface QuickActionsDialogProps {
  isQuickActionsOpen: boolean;
  setIsQuickActionsOpen: (open: boolean) => void;
  setOpenTaskModal: (open: boolean) => void;
  setOpenTodoModal: (open: boolean) => void;
  setIsCreatePostModalOpen: (open: boolean) => void;
}

const QuickActionsDialog: React.FC<QuickActionsDialogProps> = ({
  isQuickActionsOpen,
  setIsQuickActionsOpen,
  setOpenTaskModal,
  setOpenTodoModal,
  setIsCreatePostModalOpen,
}) => {
  return (
    <Dialog open={isQuickActionsOpen} onOpenChange={setIsQuickActionsOpen}>
      <DialogContent className="max-w-3xl p-0 h-[250px] rounded-[12px] bg-white border-none shadow-xl">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[13px] font-bold text-[#4A4A4A]">
              Quick Actions
            </h3>
            <button
              onClick={() => setIsQuickActionsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex justify-center flex-wrap gap-5 pb-8">
            {[
              {
                name: "Create Task",
                icon: (
                  <CheckSquare
                    className="w-7 h-7 text-[#E67E5F]"
                    strokeWidth={1.5}
                  />
                ),
                onClick: () => {
                  setOpenTaskModal(true);
                },
              },
              {
                name: "Raise Ticket",
                icon: (
                  <AlertCircle
                    className="w-7 h-7 text-[#E67E5F]"
                    strokeWidth={1.5}
                  />
                ),
              },
              {
                name: "Add To-do",
                icon: (
                  <ListTodo
                    className="w-7 h-7 text-[#E67E5F]"
                    strokeWidth={1.5}
                  />
                ),
                onClick: () => {
                  setOpenTodoModal(true);
                },
              },
              {
                name: "Create Post",
                icon: (
                  <PenTool
                    className="w-7 h-7 text-[#E67E5F]"
                    strokeWidth={1.5}
                  />
                ),
                onClick: () => {
                  setIsCreatePostModalOpen(true);
                },
              },
            ].map((action, i) => (
              <div
                key={i}
                onClick={() => {
                  action.onClick?.();
                  setIsQuickActionsOpen(false)
                }}
                className="flex flex-col items-center justify-center w-[140px] h-[120px] bg-[#FCFBF8] rounded-xl cursor-pointer hover:bg-[#F4F2EC] transition-all group"
              >
                <div className="w-[52px] h-[52px] bg-white rounded-xl flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[#F0ECE1] group-hover:scale-105 transition-transform duration-300 mb-4">
                  {action.icon}
                </div>
                <span className="text-[12px] font-bold text-[#3D3D3D] tracking-tight">
                  {action.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickActionsDialog;
