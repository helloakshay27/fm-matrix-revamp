
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { useParams } from 'react-router-dom';

export const DesignInsightDetailsDashboard = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for the specific design insight
  const designInsightData = {
    id: `#${id || '231'}`,
    category: 'Façade',
    subCategory: '',
    zone: 'Mumbai',
    site: 'Lockated',
    location: 'Basement',
    categorization: '',
    mustHave: 'Yes',
    observation: 'Clean the water',
    recommendation: 'Mark',
    tag: 'Workaround'
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Navigate to edit form
    window.location.href = `/transitioning/design-insight/edit/${id || '231'}`;
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">
          Design Insight {'>'} Design Insight Details
        </span>
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          DESIGN INSIGHT DETAILS ({designInsightData.id})
        </h1>
        <Button 
          onClick={handleEdit}
          className="bg-[#C72030] hover:bg-[#A61B28] text-white"
          size="sm"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Design Details Section */}
      <Card className="mb-6">
        <CardHeader className="bg-orange-100">
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">⚙</span>
            DESIGN DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">Category</span>
                <span className="ml-2">: {designInsightData.category}</span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">Zone</span>
                <span className="ml-2">: {designInsightData.zone}</span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">location</span>
                <span className="ml-2">: {designInsightData.location}</span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">Must Have</span>
                <span className="ml-2">: {designInsightData.mustHave}</span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">Observation</span>
                <span className="ml-2">: {designInsightData.observation}</span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">Recommendation</span>
                <span className="ml-2">: {designInsightData.recommendation}</span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">Tag</span>
                <span className="ml-2">: {designInsightData.tag}</span>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">Sub Category</span>
                <span className="ml-2">: {designInsightData.subCategory || '-'}</span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">Site</span>
                <span className="ml-2">: {designInsightData.site}</span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">Categorization</span>
                <span className="ml-2">: {designInsightData.categorization || '-'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments Section */}
      <Card>
        <CardHeader className="bg-orange-100">
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">0</span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-16 h-16 bg-gray-200 rounded border">
            {/* Placeholder for attachment thumbnail */}
            <div className="w-full h-full bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignInsightDetailsDashboard;
