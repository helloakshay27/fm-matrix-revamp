
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paperclip } from 'lucide-react';


export const AttachmentsSection: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader 
        className="flex flex-row items-center gap-5 py-[50px] px-[50px]"
      >
<div 
  className="flex items-center justify-center border border-[#C72030]"
  style={{
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  }}
>
  <Paperclip size={18} color="#C72030" />
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
          <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center" style={{ borderColor: '#C72030' }}>
            <p style={{ color: '#C72030' }}>
              Drag & Drop or <span className="cursor-pointer underline" style={{ color: '#C72030' }}>Choose File</span>
            </p>
            <p className="text-sm mt-1" style={{ color: '#C72030', opacity: 0.7 }}>No file chosen</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
