import { useState } from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Heart, X } from "lucide-react";

interface Like {
    id: number;
    user_id: number;
    thing_id: number;
    created_at: string;
    updated_at: string;
    thing_type: string;
    thing: null;
    emoji_name: string | null;
    user_name: string;
    site_name: string;
    profile_image: string | null;
}

interface ReactionsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reactions: Like[];
}

export const ReactionsModal = ({
    open,
    onOpenChange,
    reactions,
}: ReactionsModalProps) => {
    const EMOJI_MAP: Record<string, string> = {
        thumbs_up: "👍",
        laugh: "😂",
        heart: "❤️",
        angry: "😠",
        clap: "👏",
    };

    // Group reactions by emoji
    const groupedReactions = reactions.reduce(
        (acc, reaction) => {
            const emoji = reaction.emoji_name || "thumbs_up";
            if (!acc[emoji]) {
                acc[emoji] = [];
            }
            acc[emoji].push(reaction);
            return acc;
        },
        {} as Record<string, Like[]>
    );

    // Sort emoji groups by count (descending)
    const sortedEmojis = Object.keys(groupedReactions).sort(
        (a, b) => groupedReactions[b].length - groupedReactions[a].length
    );

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();

        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) {
            return "Just now";
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(
        sortedEmojis[0] || null
    );

    const currentReactions = selectedEmoji ? groupedReactions[selectedEmoji] : [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm bg-white rounded-[20px] p-0 flex flex-col border-0 shadow-lg max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl"><Heart color="#c72030" size={18} /></span>
                        <h2 className="font-semibold text-gray-900">Reactions</h2>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Emoji Filter Tabs */}
                <div className="flex gap-2 px-6 pb-4 overflow-x-auto">
                    {/* All Tab */}
                    <button
                        onClick={() => setSelectedEmoji(null)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${selectedEmoji === null
                            ? "bg-[#a89968] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-150"
                            }`}
                    >
                        <span className="text-sm">All</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selectedEmoji === null
                            ? "bg-white text-[#a89968]"
                            : "bg-white text-gray-700"
                            }`}>
                            {reactions.length}
                        </span>
                    </button>

                    {/* Emoji Tabs */}
                    {sortedEmojis.map((emoji) => (
                        <button
                            key={emoji}
                            onClick={() => setSelectedEmoji(emoji)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full whitespace-nowrap transition-colors ${selectedEmoji === emoji
                                ? "bg-gray-200"
                                : "bg-gray-100 hover:bg-gray-150"
                                }`}
                        >
                            <span className="text-xl">{EMOJI_MAP[emoji] || emoji}</span>
                            <span className="text-xs font-semibold text-gray-700 px-1.5">
                                {groupedReactions[emoji].length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Reactions List */}
                <div className="flex-1 overflow-y-auto px-6">
                    {selectedEmoji === null ? (
                        // All reactions
                        <div className="space-y-4 py-4">
                            {reactions.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No reactions yet
                                </div>
                            ) : (
                                reactions.map((reaction) => (
                                    <div key={reaction.id} className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3 flex-1">
                                            <img
                                                src={
                                                    reaction.profile_image ||
                                                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${reaction.user_name}`
                                                }
                                                alt={reaction.user_name}
                                                className="w-12 h-12 rounded-full flex-shrink-0"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {reaction.user_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatTimestamp(reaction.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-2xl flex-shrink-0">
                                            {EMOJI_MAP[reaction.emoji_name || "thumbs_up"] ||
                                                reaction.emoji_name}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        // Filtered reactions
                        <div className="space-y-4 py-4">
                            {currentReactions?.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No reactions
                                </div>
                            ) : (
                                currentReactions.map((reaction) => (
                                    <div key={reaction.id} className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3 flex-1">
                                            <img
                                                src={
                                                    reaction.profile_image ||
                                                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${reaction.user_name}`
                                                }
                                                alt={reaction.user_name}
                                                className="w-12 h-12 rounded-full flex-shrink-0"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {reaction.user_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatTimestamp(reaction.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-2xl flex-shrink-0">
                                            {EMOJI_MAP[reaction.emoji_name || "thumbs_up"] ||
                                                reaction.emoji_name}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Footer - People reacted count */}
                <div className="border-t border-gray-200 px-6 py-4 text-center">
                    <p className="text-sm text-gray-600 font-medium">
                        {reactions.length} {reactions.length === 1 ? 'person' : 'people'} reacted
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};
