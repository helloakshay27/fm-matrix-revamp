import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormDataPreviewProps {
  assetData: any;
  extraFieldsAttributes: any[];
}

export const FormDataPreview: React.FC<FormDataPreviewProps> = ({
  assetData,
  extraFieldsAttributes
}) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Form Data Preview (Dev Mode)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-700">Basic Asset Data:</h4>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
              {JSON.stringify(assetData, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-700">Extra Fields Attributes:</h4>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
              {JSON.stringify(extraFieldsAttributes, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};