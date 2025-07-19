import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicAssetForm } from '@/components/forms/DynamicAssetForm';

const AddAssetPage = () => {
  const navigate = useNavigate();
  const [selectedAssetCategory, setSelectedAssetCategory] = useState('default');

  const handleGoBack = () => {
    navigate('/maintenance/asset');
  };

  const handleSuccess = () => {
    navigate('/maintenance/asset');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Add Asset</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Asset Category Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Asset Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAssetCategory}
              onValueChange={setSelectedAssetCategory}
              className="flex flex-wrap gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="default" />
                <Label htmlFor="default">General Asset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="land" id="land" />
                <Label htmlFor="land">Land</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="building" id="building" />
                <Label htmlFor="building">Building</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vehicle" id="vehicle" />
                <Label htmlFor="vehicle">Vehicle</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="leasehold" id="leasehold" />
                <Label htmlFor="leasehold">Leasehold Improvement</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Dynamic Asset Form */}
        <DynamicAssetForm 
          assetType={selectedAssetCategory}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default AddAssetPage;