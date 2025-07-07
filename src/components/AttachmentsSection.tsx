
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AttachmentsSection: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="bg-orange-100">
        <CardTitle className="text-orange-600 flex items-center gap-2">
          <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">📎</span>
          ATTACHMENTS
        </CardTitle>
      </CardHeader>
      <CardContent className="px-[50px] py-[50px]">
        <div>
          <div className="mt-2 border-2 border-dashed border-orange-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              Drag & Drop or <span className="text-orange-600 cursor-pointer">Choose File</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">No file chosen</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
