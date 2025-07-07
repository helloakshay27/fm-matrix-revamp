
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AttachmentsSection: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader 
        className="flex flex-row items-center gap-5 py-[50px] px-[50px]"
      >
        <div 
          className="flex items-center justify-center"
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#C72030',
            borderRadius: '50%'
          }}
        >
          <span 
            className="flex items-center justify-center"
            style={{
              width: '18px',
              height: '18px',
              color: '#FFFFFF'
            }}
          >
            📎
          </span>
        </div>
        <CardTitle 
          className="font-['Work_Sans']"
          style={{
            fontSize: '26px',
            fontWeight: '600',
            lineHeight: 'auto',
            letterSpacing: '0%',
            color: '#C72030',
            backgroundColor: '#FFFFFF',
            paddingLeft: '20px',
            textAlign: 'center',
            textTransform: 'uppercase'
          }}
        >
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
