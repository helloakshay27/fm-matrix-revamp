import React from "react";
import {
  MoreVertical,
  Heart,
  MessageSquare,
  Share2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GlassCard from "../GlassCard";
import { Post } from "../types";
import { formatTimestamp } from "../utils";

interface PostItemProps {
  post: Post;
  setDeleteConfirmation: (conf: any) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, setDeleteConfirmation }) => {
  return (
    <GlassCard className="p-8 sm:p-10 !bg-white border hover:border-gray-200/50 !rounded-2xl shadow-sm transition-all">
      <div className="flex justify-between items-start mb-8">
        <div className="flex gap-5 items-center">
          <img
            src={
              post.creator_image_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.creator_full_name}`
            }
            alt="Creator"
            className="w-14 h-14 rounded-full border-2 border-white shadow-sm"
          />
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-none">
              {post.creator_full_name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 font-bold text-[10px] text-gray-400 uppercase tracking-widest">
              <span>Product Manager</span>
              <span className="w-1 h-1 rounded-full bg-gray-200" />
              <span>{formatTimestamp(post.created_at)}</span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-300 hover:text-gray-600 p-2">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl p-2">
            <DropdownMenuItem
              className="text-[#E67E5F] font-bold text-xs rounded-xl"
              onClick={() =>
                setDeleteConfirmation({
                  open: true,
                  type: "post",
                  id: post.id,
                })
              }
            >
              DELETE POST
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {post.title && (
        <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
          {post.title}
        </h2>
      )}
      <p className="text-[15px] text-gray-600 leading-relaxed mb-8 font-medium">
        {post.body}
      </p>
      {post.attachments?.map(
        (att) =>
          att.document_content_type.startsWith("image/") && (
            <div
              key={att.id}
              className="rounded-3xl overflow-hidden mb-8 border border-gray-100 shadow-sm transition-transform hover:scale-[1.01] duration-500"
            >
              <img src={att.url} className="w-full h-full" alt="Post attachment" />
            </div>
          )
      )}
      <div className="flex items-center gap-8 pt-6 border-t border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-widest">
        <div className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors cursor-pointer">
          <Heart
            className={`w-5 h-5 ${
              post.total_likes > 0 ? "text-red-500 fill-red-500" : ""
            }`}
          />{" "}
          {post.total_likes}
        </div>
        <div className="flex items-center gap-2 hover:text-gray-600 transition-colors cursor-pointer">
          <MessageSquare className="w-5 h-5" /> {post.comments.length}
        </div>
        <button className="ml-auto hover:text-[#E67E5F] transition-colors flex items-center gap-2">
          <Share2 className="w-5 h-5" /> Share
        </button>
      </div>
    </GlassCard>
  );
};

export default PostItem;
