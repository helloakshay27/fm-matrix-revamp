import React from "react";
import { Image, Video, Activity } from "lucide-react";
import GlassCard from "../GlassCard";

interface PostConsoleProps {
  displayName: string;
  setIsCreatePostModalOpen: (open: boolean) => void;
  setCreateMode: (mode: "post" | "poll" | null) => void;
}

const PostConsole: React.FC<PostConsoleProps> = ({
  displayName,
  setIsCreatePostModalOpen,
  setCreateMode,
}) => {
  const handleOpenCreatePost = () => {
    setCreateMode("post");
    setIsCreatePostModalOpen(true);
  };

  return (
    <GlassCard className="p-0 !bg-white shadow-sm !border-gray-100/50 !rounded-2xl overflow-hidden">
      <div className="p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#E6E0F1] flex items-center justify-center shrink-0 border border-white shadow-sm overflow-hidden text-[#5D56C1] font-black text-xs uppercase">
          {displayName.charAt(0)}
        </div>
        <div
          onClick={handleOpenCreatePost}
          className="flex-1 bg-[#FAF9F6] border border-gray-100 rounded-full px-6 py-2 text-sm text-gray-400 cursor-pointer hover:bg-white hover:border-[#E67E5F]/30 transition-all font-medium"
        >
          What's on your mind?
        </div>
        <button
          onClick={handleOpenCreatePost}
          className="bg-[#E67E5F] text-white px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 flex-shrink-0"
        >
          + Create Post
        </button>
      </div>
      <div className="h-px bg-gray-100 mx-6" />
      <div className="px-6 py-4 flex items-center gap-8">
        <button className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500 hover:text-[#E67E5F] transition-colors">
          <Image className="w-4 h-4" /> Add Photo
        </button>
        <button className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500 hover:text-[#E67E5F] transition-colors">
          <Video className="w-4 h-4" /> Add Video
        </button>
        <button className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500 hover:text-[#E67E5F] transition-colors">
          <Activity className="w-4 h-4" /> Add Feeling
        </button>
      </div>
    </GlassCard>
  );
};

export default PostConsole;
