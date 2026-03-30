import React from 'react';
import { MessageSquare, Users, Search, SendHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const TeamChat = () => {
    return (
        <div className="flex flex-col h-[calc(100vh-280px)] min-h-[600px] bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm mt-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#A31616] via-[#630D0D] to-[#000000] p-6 text-white space-y-4 rounded-t-xl">
                <div className="flex items-center gap-3">
                    <div className="bg-[#FFFFFF33] p-2.5 rounded-xl">
                        <MessageSquare className="w-6 h-6 fill-white/20" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold leading-tight">Team Chat</h2>
                        <div className="flex items-center gap-1.5 text-white/70 text-sm mt-0.5">
                            <Users className="w-3.5 h-3.5" />
                            <span>16 members</span>
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-white/80 transition-colors" />
                    <Input
                        placeholder="Search messages..."
                        className="bg-[#FFFFFF1A] border-none text-white placeholder:text-white/40 pl-10 h-8 focus-visible:ring-1 focus-visible:ring-white/30 transition-all rounded-[8px]"
                    />
                </div>
            </div>

            {/* Content Area */}
            <ScrollArea className="flex-1 p-6 flex flex-col items-center justify-center min-h-[300px]">
                <div className="h-full w-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                    <div className="bg-gray-50 p-6 rounded-2xl">
                        <MessageSquare className="w-12 h-12 text-gray-300" strokeWidth={1.5} />
                    </div>
                    <p className="text-gray-500 font-medium">No messages yet. Start the conversation!</p>
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto space-y-3">
                    <div className="relative flex items-center gap-3">
                        <Input
                            placeholder="Type your message... (Use @ to mention)"
                            className="flex-1 bg-white border-gray-200 h-12 pl-4 pr-12 focus-visible:ring-primary/20 rounded-xl"
                        />
                        <Button
                            size="icon"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#C1A5FF] hover:bg-[#B195FF] text-white rounded-lg transition-colors"
                        >
                            <SendHorizontal className="w-5 h-5" />
                        </Button>
                    </div>
                    <p className="text-[11px] text-gray-400 pl-1">
                        Press <span className="font-semibold">Enter</span> to send, <span className="font-semibold">Shift+Enter</span> for new line • Use <span className="font-semibold">@</span> to mention
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TeamChat;
