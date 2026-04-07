import React from "react";
import {
  MoreVertical,
  Heart,
  MessageSquare,
  Share2,
  Send,
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
  handleLikePost: (postId: number) => void;
  handleAddComment: (postId: number, commentBody: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  setDeleteConfirmation,
  handleLikePost,
  handleAddComment,
}) => {
  const [showComments, setShowComments] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");

  const onAddComment = () => {
    if (!commentText.trim()) return;
    handleAddComment(post.id, commentText);
    setCommentText("");
  };
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
              <span>{post.creator_site_name || "Community Member"}</span>
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
      <p className="text-[15px] text-gray-600 leading-relaxed mb-6 font-medium">
        {post.body}
      </p>

      {/* Poll Options */}
      {post.poll_options && post.poll_options.length > 0 && (
        <div className="mb-8 space-y-3">
          {post.poll_options.map((option) => (
            <div
              key={option.id}
              className="relative bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 transition-all hover:border-[#E67E5F]/30 overflow-hidden group cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-[#E67E5F]/5 transition-all duration-500"
                style={{ width: `${option.vote_percentage}%` }}
              />
              <div className="relative flex justify-between items-center text-sm">
                <span className={`font-bold transition-colors ${option.voted === "true" || option.voted === true ? "text-[#E67E5F]" : "text-gray-700"}`}>
                  {option.name}
                  {(option.voted === "true" || option.voted === true) && (
                    <span className="ml-2 text-[10px] bg-[#E67E5F] text-white px-2 py-0.5 rounded-full uppercase">Your Vote</span>
                  )}
                </span>
                <span className="text-gray-400 font-bold tabular-nums">
                  {option.vote_percentage}%
                </span>
              </div>
            </div>
          ))}
          <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center mt-2">
            {post.total_votes || 0} total votes
          </div>
        </div>
      )}
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
        <div
          onClick={() => handleLikePost(post.id)}
          className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors cursor-pointer"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              post.isliked ? "text-red-500 fill-red-500 scale-110" : "text-gray-400 group-hover:text-red-400"
            }`}
            fill={post.isliked ? "currentColor" : "none"}
          />{" "}
          <span className={post.isliked ? "text-red-500 font-bold" : ""}>
            {post.total_likes || 0}
          </span>
        </div>
        <div
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 hover:text-gray-600 transition-colors cursor-pointer group"
        >
          <MessageSquare className={`w-5 h-5 ${showComments ? "text-[#E67E5F]" : "text-gray-400"}`} /> 
          <span className={showComments ? "text-[#E67E5F] font-bold" : ""}>
            {post.total_comments ?? post.comments?.length ?? 0}
          </span>
        </div>
        <button className="ml-auto hover:text-[#E67E5F] transition-colors flex items-center gap-2">
          <Share2 className="w-5 h-5" /> Share
        </button>
      </div>

      {showComments && (
        <div className="mt-8 pt-8 border-t border-gray-50 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-6 mb-8">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <img
                    src={
                      comment.commentor_profile_image ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.commentor_full_name}`
                    }
                    alt={comment.commentor_full_name}
                    className="w-10 h-10 rounded-full border border-gray-100"
                  />
                  <div className="flex-1 bg-gray-50/50 rounded-2xl px-5 py-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-900 text-sm">
                        {comment.commentor_full_name} <span className="text-[10px] font-normal text-gray-400">#{comment.commentor_id}</span>
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">
                        {formatTimestamp(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {comment.body}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400 text-xs italic">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>

          <div className="flex gap-4 items-center bg-gray-50/50 rounded-full pl-6 pr-2 py-2 border border-gray-100 focus-within:border-[#E67E5F]/30 transition-all">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 font-medium"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAddComment()}
            />
            <button
              onClick={onAddComment}
              disabled={!commentText.trim()}
              className="w-10 h-10 rounded-full bg-[#E67E5F] text-white flex items-center justify-center hover:bg-[#D46C4D] transition-colors disabled:opacity-50 disabled:grayscale"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default PostItem;
