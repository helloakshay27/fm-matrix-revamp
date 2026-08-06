import {
  Button,
} from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Image as ImageIcon,
  Info,
  Pencil,
  Plus,
  Star,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";
import { badgePoints } from "../constants";
import { useDailyReport } from "../context/DailyReportContext";
import {
  cleanReportText,
  fmtDate,
  fmtHours,
  isImageFile,
} from "../utils";
import type { AttachmentFile } from "../types";

export const AccomplishmentsCard = () => {
  const {
    accomplishmentsSectionRef,
    dailyScore,
    addAccomplishment,
    visibleAccomplishments,
    autoAddedAccomplishments,
    toggleAccomplishment,
    toggleStar,
    setConvertMenuAnchor,
    setConvertMenuItem,
    updateAccomplishmentText,
    planningItems,
    setPlanningItems,
    accomplishments,
    setAccomplishments,
    markDraftDirty,
    removeAccomplishment,
    startDate,
    navigate,
    setSelectedTodo,
    setIsDetailsModalOpen,
    setEditTaskData,
    setIsEditTaskModalOpen,
    setEditIssueData,
    setIsEditIssueModalOpen,
    setEditTodoData,
    setIsEditTodoModalOpen,
    setPendingReopenItem,
    setReopenReason,
    autoStarredIds,
    setAutoStarredIds,
    fileInputRef,
    handleFileChange,
    triggerFileUpload,
    uploadedFiles,
    setUploadedFiles,
    reportAttachments,
  } = useDailyReport();

  return (
    <div className="bc-daily-card" ref={accomplishmentsSectionRef}>
      <div className="bc-daily-card-header">
        <div className="flex min-w-0 items-center gap-2">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#DA7756]" />
          <h3 className="min-w-0 text-sm font-bold text-[#1a1a1a]">
            Today&apos;s Accomplishments
          </h3>
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start sm:gap-3">
          <Badge variant="outline" className={badgePoints}>
            {dailyScore.accomplishmentsScore}/20 Pts
          </Badge>
          <button
            type="button"
            className="bc-add-outline-btn"
            onClick={addAccomplishment}
          >
            <Plus size={14} />
            Add Item
          </button>
        </div>
      </div>

      <div className="bc-daily-card-body space-y-6">
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {visibleAccomplishments.length === 0 &&
            autoAddedAccomplishments.length === 0 && (
              <div className="flex flex-col items-center justify-center border-t border-dashed border-gray-200 px-4 pb-3 pt-10 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-200 bg-emerald-50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-300 bg-emerald-100">
                    <Check size={16} className="text-emerald-400" />
                  </div>
                </div>
                <h4 className="text-base font-black text-emerald-800">
                  What did you get done today?
                </h4>
                <p className="mt-2 text-sm font-medium text-gray-500">
                  Complete tasks to auto-populate this section, or add entries
                  manually.
                </p>
              </div>
            )}

          {visibleAccomplishments.map((item) => (
            <div
              key={item.id}
              className="relative group animate-in fade-in duration-300"
            >
              <div
                className={cn(
                  "flex flex-col gap-1 bg-white border rounded-[10px] p-3 transition-all",
                  item.completed
                    ? "border-[#DA7756]/10 bg-[#DA7756]/10"
                    : "border-gray-200",
                  item.fromYesterday && !item.completed && "border-amber-300 bg-amber-50/30"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-4 w-4 rounded-[4px] flex items-center justify-center cursor-pointer transition-colors border-2 shrink-0",
                      item.completed
                        ? "bg-[#DA7756] border-[#DA7756]"
                        : "bg-white border-gray-300"
                    )}
                    onClick={() => toggleAccomplishment(item.id)}
                  >
                    {item.completed && (
                      <Check size={14} className="text-white" />
                    )}
                  </div>

                  <Star
                    size={18}
                    className={cn(
                      "cursor-pointer transition-all shrink-0",
                      item.starred
                        ? "text-[#eab308] fill-[#eab308]"
                        : "text-[#DA7756]/70 hover:text-[#DA7756]"
                    )}
                    onClick={() => toggleStar(item.id)}
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      setConvertMenuAnchor(e.currentTarget);
                      setConvertMenuItem(item);
                    }}
                    title="Convert to Task, Issue or Todo"
                    className="relative h-5 w-[42px] group-hover:w-8 shrink-0 rounded-full bg-gray-500 overflow-hidden cursor-pointer transition-[width] duration-300 ease-out"
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase text-white transition-all duration-300 ease-out opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-50">
                      Note
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center text-white transition-all duration-300 ease-out opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100">
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.13086 6.93352V4.60019C5.13086 3.80686 5.73766 3.2002 6.53117 3.2002H6.99794" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3.73438 5.5332L5.13468 6.9332L6.53499 5.5332" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.3332 6.93352C11.144 6.93352 11.8012 6.09779 11.8012 5.06686C11.8012 4.03593 11.144 3.2002 10.3332 3.2002C9.52248 3.2002 8.86523 4.03593 8.86523 5.06686C8.86523 6.09779 9.52248 6.93352 10.3332 6.93352Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.7323 8.7998V11.1331C10.7323 11.9265 10.1255 12.5331 9.332 12.5331H8.86523" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.1346 10.1998L10.7343 8.7998L9.33398 10.1998" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.53441 12.5331C6.34516 12.5331 7.00241 11.6974 7.00241 10.6665C7.00241 9.63554 6.34516 8.7998 5.53441 8.7998C4.72365 8.7998 4.06641 9.63554 4.06641 10.6665C4.06641 11.6974 4.72365 12.5331 5.53441 12.5331Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>

                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) =>
                      updateAccomplishmentText(item.id, e.target.value)
                    }
                    placeholder="Describe your accomplishment..."
                    className={cn(
                      "flex-1 min-w-0 bg-transparent border-none outline-none text-sm font-medium transition-all",
                      item.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-700"
                    )}
                  />

                  {!item.completed &&
                    (() => {
                      const planItemId = `from-accom-${item.id}`;
                      const inPlan = planningItems.some(
                        (p) => p.id === planItemId
                      );
                      const button = (
                        <button
                          type="button"
                          onClick={() => {
                            if (inPlan) {
                              setPlanningItems((prev) =>
                                prev.filter((p) => p.id !== planItemId)
                              );
                              if (!accomplishments.some((a) => a.id === item.id)) {
                                setAccomplishments((prev) => [...prev, item]);
                              }
                            } else {
                              setAccomplishments((prev) =>
                                prev.filter((a) => a.id !== item.id)
                              );
                              const text = cleanReportText(item.text);
                              if (text) {
                                setPlanningItems((prev) => [
                                  ...prev,
                                  {
                                    id: planItemId,
                                    text: item.text,
                                    starred: false,
                                  },
                                ]);
                              }
                            }
                            markDraftDirty();
                          }}
                          className={cn(
                            "text-[10px] font-bold px-2.5 py-1.5 rounded-[6px] transition-all border whitespace-nowrap",
                            inPlan
                              ? "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                              : "bg-white border-gray-200 text-gray-500 hover:border-[#DA7756] hover:text-[#DA7756] hover:bg-[#DA7756]/5"
                          )}
                          title={
                            inPlan
                              ? "Remove from tomorrow's plan"
                              : "Add to tomorrow's plan"
                          }
                        >
                          {inPlan ? "Added ✓" : "+ Tomorrow"}
                        </button>
                      );
                      // Reserve no width until hover, so the note text can use the full row while idle.
                      if (inPlan) {
                        return <div className="shrink-0">{button}</div>;
                      }
                      return (
                        <div className="shrink-0 max-w-0 group-hover:max-w-[100px] overflow-hidden transition-[max-width] duration-300 ease-out">
                          {button}
                        </div>
                      );
                    })()}

                  <div className="shrink-0 max-w-0 group-hover:max-w-[40px] overflow-hidden transition-[max-width] duration-300 ease-out">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full border-none"
                      onClick={() => removeAccomplishment(item.id)}
                    >
                      <X size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div>

                {item.ownerName && (
                  <div className="flex items-center pt-1 flex-wrap">
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 bg-indigo-50 text-indigo-600 border border-indigo-100"
                      title={`Credited to ${item.ownerName} in the submitted report`}
                    >
                      From {item.ownerName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {autoAddedAccomplishments.map((item) => {
            const autoStarKey = String(item.id);
            const isAutoStarred = autoStarredIds.has(autoStarKey);

            return (
              <div key={item.id} className="relative animate-in fade-in duration-300">
                <div className="flex flex-col gap-1 bg-[#DA7756]/10 border border-[#DA7756]/10 rounded-[10px] p-3">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <div
                      className="h-4 w-4 rounded-[4px] flex items-center justify-center border-2 shrink-0 bg-[#DA7756] border-[#DA7756] cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => {
                        setPendingReopenItem(item);
                        setReopenReason("");
                      }}
                      title="Mark as open"
                    >
                      <Check size={14} className="text-white" />
                    </div>
                    <Star
                      size={18}
                      className={cn(
                        "cursor-pointer transition-all shrink-0",
                        isAutoStarred
                          ? "text-[#eab308] fill-[#eab308]"
                          : "text-[#DA7756]/70 hover:text-[#DA7756]"
                      )}
                      onClick={() => {
                        markDraftDirty();
                        setAutoStarredIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(autoStarKey)) next.delete(autoStarKey);
                          else next.add(autoStarKey);
                          return next;
                        });
                      }}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0",
                        item.type === "task"
                          ? "bg-[#DA7756] text-white"
                          : item.type === "issue"
                            ? "bg-violet-600 text-white"
                            : "bg-amber-500 text-white"
                      )}
                    >
                      {item.type}
                    </span>
                    <span className="flex-1 min-w-[90px] basis-[120px] text-sm font-medium text-gray-400 line-through truncate select-none">
                      {item.title}
                    </span>
                    {item.priority && (
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0"
                        style={{
                          backgroundColor:
                            item.priority === "High"
                              ? "#fee2e2"
                              : item.priority === "Medium"
                                ? "#fef3c7"
                                : "#dcfce7",
                          color:
                            item.priority === "High"
                              ? "#991b1b"
                              : item.priority === "Medium"
                                ? "#92400e"
                                : "#166534",
                        }}
                      >
                        {item.priority}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        if (item.type === "todo") {
                          setSelectedTodo(item.originalData);
                          setIsDetailsModalOpen(true);
                        } else {
                          navigate(
                            item.type === "task"
                              ? `/business-compass/tasks/${item?.id.split("-")[1]}`
                              : `/business-compass/issues/${item?.id.split("-")[1]}`
                          );
                        }
                      }}
                      className="p-1 hover:bg-white/60 rounded-[6px] transition-colors shrink-0"
                      title={`View ${item.type} details`}
                    >
                      <Eye size={14} className="text-[#DA7756]" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.type === "task") {
                          setEditTaskData(item.originalData);
                          setIsEditTaskModalOpen(true);
                        } else if (item.type === "issue") {
                          setEditIssueData(item.originalData);
                          setIsEditIssueModalOpen(true);
                        } else if (item.type === "todo") {
                          setEditTodoData(item.originalData);
                          setIsEditTodoModalOpen(true);
                        }
                      }}
                      className="p-1 text-gray-500 hover:text-[#DA7756] transition-colors shrink-0"
                      title={`Edit ${item.type}`}
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                  {(() => {
                    const d = item.originalData;
                    const dueDate = fmtDate(
                      d?.target_date || d?.due_date || d?.end_date
                    );
                    const completedDate = fmtDate(startDate);
                    const effortEst = fmtHours(
                      d?.total_allocated_hours || d?.estimated_hour
                    );
                    let issueEffort: string | null = null;
                    if (
                      item.type === "issue" &&
                      Array.isArray(d?.issue_allocation_times) &&
                      d.issue_allocation_times.length > 0
                    ) {
                      const totalMin = d.issue_allocation_times.reduce(
                        (sum: number, t: any) => sum + t.hours * 60 + t.minutes,
                        0
                      );
                      if (totalMin > 0) {
                        const h = Math.floor(totalMin / 60);
                        const m = totalMin % 60;
                        issueEffort =
                          h > 0 && m > 0
                            ? `${h}h ${m}m`
                            : h > 0
                              ? `${h}h`
                              : `${m}m`;
                      }
                    }
                    const hasInfo =
                      completedDate || dueDate || effortEst || issueEffort || (item.type === "task" && d?.active_time_till_now);
                    if (!hasInfo) return null;
                    return (
                      <div className="flex items-center gap-3 px-1 pt-1 flex-wrap">
                        {completedDate && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <CalendarIcon
                              size={9}
                              className="shrink-0"
                            />
                            {completedDate}
                          </span>
                        )}
                        {/* {dueDate && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-500">
                            <CalendarIcon
                              size={9}
                              className="shrink-0"
                            />
                            Due: {dueDate}
                          </span>
                        )} */}
                        {effortEst && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Clock
                              size={9}
                              className="shrink-0"
                            />
                            Est: {effortEst}
                          </span>
                        )}
                        {issueEffort && (
                          <span className="flex items-center gap-1 text-[10px] text-purple-600">
                            <Zap
                              size={9}
                              className="shrink-0"
                            />
                            Effort: {issueEffort}
                          </span>
                        )}
                        {item.type === "task" && d?.active_time_till_now && (
                          <span className="flex items-center gap-1 text-[10px] text-green-600">
                            <Zap size={9} className="shrink-0" />
                            <ActiveTimer
                              activeTimeTillNow={d.active_time_till_now}
                              isStarted={false}
                            />
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-2 text-[11px] leading-snug text-gray-500 sm:items-center">
            <Info size={14} className="mt-0.5 shrink-0 text-gray-400 sm:mt-0" />
            <span>Limits: Images 2MB, Others 5 MB</span>
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <button
              type="button"
              disabled={
                uploadedFiles.length + reportAttachments.length >= 5
              }
              onClick={triggerFileUpload}
              className="bc-add-outline-btn w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Upload size={14} />
              Upload File
            </button>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between bg-[#fef6f4] p-3 rounded-[10px] border border-[#DA7756]/20 animate-in fade-in duration-300"
              >
                <div className="flex items-center gap-3">
                  <ImageIcon size={16} className="text-[#DA7756]" />
                  <span className="text-sm font-medium text-[#DA7756]/80 hover:underline cursor-pointer">
                    {file.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {file.size}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full border-none"
                    onClick={() =>
                      setUploadedFiles(
                        uploadedFiles.filter((f) => f.id !== file.id)
                      )
                    }
                  >
                    <X size={14} className="text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {reportAttachments && reportAttachments.length > 0 && (
          <div className="space-y-3 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Upload size={16} className="text-purple-600" />
              <span className="text-sm font-bold text-[#1a1a1a]">
                Linked Files ({reportAttachments.length})
              </span>
            </div>
            <div className="space-y-2">
              {reportAttachments.map(
                (attachment: AttachmentFile, idx: number) => {
                  const isImage = isImageFile(
                    attachment.document_file_name,
                    attachment.document_content_type
                  );
                  return (
                    <div
                      key={attachment.id || idx}
                      className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-[10px] border border-purple-100 hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {isImage ? (
                          <ImageIcon size={20} className="text-purple-600 shrink-0" />
                        ) : (
                          <FileText size={20} className="text-blue-600 shrink-0" />
                        )}
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <a
                            href={attachment.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline line-clamp-2"
                          >
                            {attachment.document_file_name}
                          </a>
                          <span className="text-[11px] text-gray-600 font-medium">
                            {attachment.relation} •{" "}
                            {(attachment.document_file_size / 1024).toFixed(2)}{" "}
                            KB •{" "}
                            {new Date(
                              attachment.document_updated_at
                            ).toLocaleDateString("en-US", {
                              month: "numeric",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 border-none px-2.5 py-0.5 text-[10px] font-bold rounded-[4px] whitespace-nowrap">
                        {attachment.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
