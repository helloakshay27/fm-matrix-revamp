import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paperclip } from 'lucide-react';

export const AttachmentsSection: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center px-4 sm:px-6 md:px-[50px] py-6 md:py-[50px]">
        <div className="flex items-center justify-center border border-[#C72030] w-10 h-10 rounded-full">
          <Paperclip size={18} color="#C72030" />
        </div>
        <CardTitle className="pl-4 text-lg sm:text-xl md:text-2xl font-semibold uppercase text-black font-['Work_Sans']">
          Attachments
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 md:px-[50px] py-6 md:py-[50px]">
        <div className="mt-2 border-2 border-dashed rounded-lg text-center p-6 sm:p-8" style={{ borderColor: '#C72030' }}>
          <p className="text-base sm:text-lg text-[#C72030]">
            Drag & Drop or <span className="cursor-pointer underline">Choose File</span>
          </p>
          <p className="text-sm mt-1 text-[#C72030]/70">No file chosen</p>
        </div>
      </CardContent>
    </Card>
  );
};
