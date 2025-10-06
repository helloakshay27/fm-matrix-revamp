import { useState } from "react";
import { X, Pin, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

const PinnedMessagesHeader = ({ messages, onUnpin, onMessageClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const pinnedMessages = messages.filter(msg => msg.is_pinned);

    if (pinnedMessages.length === 0) return null;

    const truncateText = (text, maxLength = 50) => {
        if (!text) return "Attachment";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const renderSinglePinned = () => {
        const message = pinnedMessages[0];
        return (
            <div className="flex items-center gap-3 py-2 px-4 bg-[#FFF4E6] border-b border-[#FFE0B2]">
                <Pin className="w-4 h-4 text-[#C72030] flex-shrink-0" />
                <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => onMessageClick?.(message)}
                >
                    <div className="text-xs font-semibold text-[#C72030] mb-0.5">
                        {message.user_name}
                    </div>
                    <div className="text-sm text-gray-700 truncate">
                        {truncateText(message.body)}
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onUnpin?.(message);
                    }}
                    className="h-8 w-8 p-0 hover:bg-[#FFE0B2]"
                >
                    <X className="w-4 h-4 text-gray-600" />
                </Button>
            </div>
        );
    };

    const renderMultiplePinned = () => {
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="bg-[#FFF4E6] border-b border-[#FFE0B2]">
                    <CollapsibleTrigger className="w-full">
                        <div className="flex items-center gap-3 py-2 px-4 hover:bg-[#FFE0B2] transition-colors">
                            <Pin className="w-4 h-4 text-[#C72030] flex-shrink-0" />
                            <div className="flex-1 text-left">
                                <div className="text-sm font-semibold text-[#C72030]">
                                    {pinnedMessages.length} Pinned Messages
                                </div>
                                {!isOpen && (
                                    <div className="text-xs text-gray-600 truncate">
                                        {truncateText(pinnedMessages[0].body)}
                                    </div>
                                )}
                            </div>
                            {isOpen ? (
                                <ChevronUp className="w-4 h-4 text-gray-600" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                            )}
                        </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                        <div className="max-h-[200px] overflow-y-auto">
                            {pinnedMessages.map((message, index) => (
                                <div
                                    key={message.id || index}
                                    className="flex items-center gap-3 py-2 px-4 hover:bg-[#FFE0B2] transition-colors border-t border-[#FFE0B2] cursor-pointer"
                                    onClick={() => onMessageClick?.(message)}
                                >
                                    <div className="w-8 h-8 rounded-full bg-white text-[#C72030] text-xs flex items-center justify-center flex-shrink-0">
                                        {(message.user_name || "U")[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-semibold text-[#C72030] mb-0.5">
                                            {message.user_name}
                                        </div>
                                        <div className="text-sm text-gray-700 truncate">
                                            {truncateText(message.body, 60)}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onUnpin?.(message);
                                        }}
                                        className="h-8 w-8 p-0 hover:bg-white flex-shrink-0"
                                    >
                                        <X className="w-4 h-4 text-gray-600" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>
        );
    };

    return pinnedMessages.length === 1 ? renderSinglePinned() : renderMultiplePinned();
};

export default PinnedMessagesHeader;