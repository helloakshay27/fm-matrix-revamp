import React from "react";
import { X, Activity, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface PostModalsProps {
  isCreatePostModalOpen: boolean;
  setIsCreatePostModalOpen: (open: boolean) => void;
  createMode: "post" | "poll" | null;
  setCreateMode: (mode: "post" | "poll" | null) => void;
  postText: string;
  setPostText: (text: string) => void;
  displayName: string;
  pollOptions: string[];
  setPollOptions: (options: string[]) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  setSelectedFiles: (files: File[]) => void;
  selectedFiles: File[];
  handlePublish: () => void;
  deleteConfirmation: {
    open: boolean;
    type: "post" | "comment" | null;
    id: number | string | null;
  };
  setDeleteConfirmation: (conf: any) => void;
  confirmDelete: () => void;
}

export const PostModals: React.FC<PostModalsProps> = ({
  isCreatePostModalOpen,
  setIsCreatePostModalOpen,
  createMode,
  setCreateMode,
  postText,
  setPostText,
  displayName,
  pollOptions,
  setPollOptions,
  fileInputRef,
  setSelectedFiles,
  selectedFiles,
  handlePublish,
  deleteConfirmation,
  setDeleteConfirmation,
  confirmDelete,
}) => {
  return (
    <>
      <Dialog
        open={isCreatePostModalOpen}
        onOpenChange={setIsCreatePostModalOpen}
      >
        <DialogContent className="max-w-lg p-0 rounded-3xl overflow-hidden bg-white border-none shadow-2xl">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight">
                Create {createMode === "poll" ? "Poll" : "Post"}
              </h2>
              <button onClick={() => setIsCreatePostModalOpen(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder={`What's on your mind, ${displayName}?`}
              className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-sm min-h-[140px] focus:outline-none focus:ring-4 focus:ring-[#E67E5F]/5 transition-all"
            />

            {createMode === "poll" && (
              <div className="mt-4 space-y-2">
                {pollOptions.map((o, i) => (
                  <input
                    key={i}
                    value={o}
                    onChange={(e) => {
                      const n = [...pollOptions];
                      n[i] = e.target.value;
                      setPollOptions(n);
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="w-full bg-gray-50 p-3 border border-gray-100 rounded-xl text-xs font-bold"
                  />
                ))}
                <button
                  className="text-[10px] font-black text-[#E67E5F] uppercase"
                  onClick={() => setPollOptions([...pollOptions, ""])}
                >
                  + Add Option
                </button>
              </div>
            )}

            <div className="mt-8 flex justify-between items-center">
              <div className="flex gap-3">
                <button
                  className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-gray-100"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Activity className="w-5 h-5 text-gray-500" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  multiple
                  onChange={(e) =>
                    setSelectedFiles(Array.from(e.target.files || []))
                  }
                />
                <button
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    createMode === "poll"
                      ? "bg-[#E67E5F] text-white"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    setCreateMode(createMode === "poll" ? null : "poll")
                  }
                >
                  <TrendingUp className="w-5 h-5" />
                </button>
              </div>
              <button
                disabled={!postText.trim() && selectedFiles.length === 0}
                onClick={handlePublish}
                className="bg-[#E67E5F] text-white px-10 py-3 rounded-2xl font-black shadow-xl hover:bg-[#a01a26] disabled:opacity-30 uppercase tracking-widest text-sm"
              >
                PUBLISH
              </button>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedFiles.map((f, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-2 rounded-lg text-[10px] font-bold flex gap-2"
                  >
                    {f.name}{" "}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        setSelectedFiles(
                          selectedFiles.filter((_, idx) => idx !== i)
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmation.open}
        onOpenChange={(o) =>
          !o && setDeleteConfirmation({ open: false, type: null, id: null })
        }
      >
        <DialogContent className="max-w-xs rounded-3xl p-6 text-center">
          <DialogTitle className="font-black text-xl mb-4">
            DELETE {deleteConfirmation.type?.toUpperCase()}?
          </DialogTitle>
          <div className="flex gap-2">
            <button
              className="flex-1 py-3 text-sm font-bold bg-gray-100 rounded-2xl"
              onClick={() =>
                setDeleteConfirmation({ open: false, type: null, id: null })
              }
            >
              CANCEL
            </button>
            <button
              className="flex-1 py-3 text-sm font-bold bg-[#E67E5F] text-white rounded-2xl"
              onClick={confirmDelete}
            >
              DELETE
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
