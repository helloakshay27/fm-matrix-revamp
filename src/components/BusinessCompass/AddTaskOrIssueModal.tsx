import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CheckSquare, 
  AlertTriangle, 
  X, 
  Upload, 
  Info,
  Calendar as CalendarIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AddTaskOrIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTaskOrIssueModal: React.FC<AddTaskOrIssueModalProps> = ({ isOpen, onClose }) => {
  const [type, setType] = useState<"task" | "issue">("task");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("me");
  const [priority, setPriority] = useState("medium");
  const [targetDate, setTargetDate] = useState("");

  const handleCreate = () => {
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] w-[95vw] p-0 overflow-hidden border-none rounded-[12px] font-poppins max-h-[98vh] flex flex-col shadow-2xl">
        <DialogHeader className="px-5 py-3.5 flex flex-row items-center justify-between shrink-0 border-b border-gray-50 bg-white">
          <DialogTitle className="text-base sm:text-lg font-bold text-[#1e293b] tracking-tight">
            Add Task or Issue
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-gray-100 border-none transition-colors"
            onClick={onClose}
          >
            <X size={18} className="text-gray-400" />
          </Button>
        </DialogHeader>

        <div className="px-5 py-4 space-y-3.5 overflow-y-auto flex-1 scrollbar-none bg-[#fcfcfc]">
          <div className="space-y-2">
            <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Type *</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                className={cn(
                  "h-10 rounded-[10px] flex items-center justify-center gap-2.5 font-black transition-all border-none text-[11px] tracking-wide",
                  type === "task"
                    ? "bg-[#b91c1c] text-white shadow-lg shadow-[#b91c1c]/20"
                    : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 hover:text-gray-600"
                )}
                onClick={() => setType("task")}
              >
                <CheckSquare size={16} className={cn(type === "task" ? "text-white" : "text-current")} />
                TASK
              </Button>
              <Button
                type="button"
                className={cn(
                  "h-10 rounded-[10px] flex items-center justify-center gap-2.5 font-black transition-all border-none text-[11px] tracking-wide",
                  type === "issue"
                    ? "bg-[#b91c1c] text-white shadow-lg shadow-[#b91c1c]/20"
                    : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 hover:text-gray-600"
                )}
                onClick={() => {
                  setType("issue");
                  setPriority("critical");
                  setTargetDate(today);
                }}
              >
                <AlertTriangle size={16} className={cn(type === "issue" ? "text-white" : "text-current")} />
                ISSUE
              </Button>
            </div>
          </div>

          <div className="bg-[#f8fafc] p-2.5 rounded-[10px] border border-gray-100 shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] leading-relaxed flex items-center gap-1.5 font-medium">
                <span className="font-black text-[#b91c1c] uppercase tracking-tighter w-12">Task:</span>{" "}
                <span className="text-gray-500">Something actionable to complete.</span>
              </p>
              <p className="text-[10px] leading-relaxed flex items-center gap-1.5 font-medium">
                <span className="font-black text-[#ea580c] uppercase tracking-tighter w-12">Issue:</span>{" "}
                <span className="text-gray-500">A problem or blocker needing resolution.</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Title *</Label>
              <Input
                placeholder="Brief description"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 rounded-[8px] border-gray-200 bg-white focus:ring-[#b91c1c]/10 text-[13px] font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Assign To *</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="h-9 rounded-[8px] border-gray-200 bg-white text-[13px] font-medium">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] border-gray-100 shadow-xl">
                  <SelectItem value="me">Common Admin Id (Me)</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="team">Team Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Description</Label>
            <Textarea
              placeholder="Detailed description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[50px] rounded-[8px] border-gray-200 bg-white focus:ring-[#b91c1c]/10 resize-none py-2 text-[13px] font-medium leading-relaxed"
            />
          </div>

          {type === "task" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Priority *</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="h-9 rounded-[8px] border-gray-200 bg-white text-[13px] font-medium">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        priority === "critical" ? "bg-red-600" : priority === "medium" ? "bg-amber-500" : "bg-blue-500"
                      )} />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-[10px] border-gray-100 shadow-xl">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Target Date *</Label>
                <div className="relative">
                  <Input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="h-9 rounded-[8px] border-gray-200 bg-white pl-3 pr-9 focus:ring-[#b91c1c]/10 appearance-none text-[13px] font-medium"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-[10px] bg-[#fef2f2] border border-[#b91c1c]/10 flex gap-3 animate-in slide-in-from-top-1 duration-300 shadow-sm items-center">
              <div className="bg-white p-1 rounded-md shadow-sm h-fit shrink-0">
                <AlertTriangle size={15} className="text-[#ea580c]" />
              </div>
              <p className="text-[11px] font-medium text-[#721c24] leading-normal italic">
                <span className="font-black text-[#b91c1c] uppercase tracking-tighter mr-1">Note:</span> 
                Issues default to <span className="font-bold text-[#b91c1c]">Critical</span> priority and <span className="font-bold text-[#b91c1c]">today's date</span>.
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-green-50 p-1 rounded-full border border-green-100">
                <Info size={12} className="text-green-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">
                  Docs Limits: 2MB / 5MB
                </span>
                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">0/5 Files Attached</span>
              </div>
            </div>
            <Button size="sm" className="bg-[#10b981] hover:bg-[#059669] text-white px-4 h-8 rounded-[8px] flex items-center justify-center gap-2 font-black shadow-md border-none text-[10px] tracking-widest">
              <Upload size={14} />
              UPLOAD
            </Button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 shrink-0">
            <Button
              variant="outline"
              className="px-6 h-10 rounded-[10px] border-gray-100 text-gray-400 font-black hover:bg-gray-50 bg-white text-[11px] tracking-widest transition-all"
              onClick={onClose}
            >
              CANCEL
            </Button>
            <Button
              className="px-8 h-10 rounded-[10px] bg-[#1e293b] hover:bg-[#0f172a] text-white font-black shadow-xl border-none text-[11px] tracking-widest transition-all"
              onClick={handleCreate}
            >
              CREATE {type.toUpperCase()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskOrIssueModal;
