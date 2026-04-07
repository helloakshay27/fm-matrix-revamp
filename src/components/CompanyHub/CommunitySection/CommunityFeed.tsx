import React from "react";
import PostConsole from "./PostConsole";
import PostItem from "./PostItem";
import GlassCard from "../GlassCard";
import { Post } from "../types";

interface CommunityFeedProps {
  displayName: string;
  setIsCreatePostModalOpen: (open: boolean) => void;
  setCreateMode: (mode: "post" | "poll" | null) => void;
  isLoadingPosts: boolean;
  posts: Post[];
  setDeleteConfirmation: (conf: any) => void;
  handleLikePost: (postId: number) => void;
  handleAddComment: (postId: number, commentBody: string) => void;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({
  displayName,
  setIsCreatePostModalOpen,
  setCreateMode,
  isLoadingPosts,
  posts,
  setDeleteConfirmation,
  handleLikePost,
  handleAddComment,
}) => {
  return (
    <div className="lg:col-span-8 space-y-8">
      <PostConsole
        displayName={displayName}
        setIsCreatePostModalOpen={setIsCreatePostModalOpen}
        setCreateMode={setCreateMode}
      />

      {isLoadingPosts ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <GlassCard key={i} className="p-8 animate-pulse">
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 w-1/4"></div>
                  <div className="h-3 bg-gray-100 w-1/6"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-100 w-full rounded mb-3"></div>
              <div className="h-4 bg-gray-100 w-3/4 rounded"></div>
            </GlassCard>
          ))}
        </div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            setDeleteConfirmation={setDeleteConfirmation}
            handleLikePost={handleLikePost}
            handleAddComment={handleAddComment}
          />
        ))
      ) : (
        <div className="text-center py-20 text-gray-400 italic">
          No community posts yet.
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
