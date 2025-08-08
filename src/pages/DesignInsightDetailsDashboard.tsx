
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { useParams, useNavigate } from 'react-router-dom';

export const DesignInsightDetailsDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [designInsightData, setDesignInsightData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token || !id) return;
        const res = await fetch(`https://${baseUrl}/pms/design_inputs.json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const found = (data.data || []).find((item: any) => String(item.id) === String(id));
        if (found) {
          // Normalize tag for display to match select options
          let tagValue = found.tag || '-';
          if (typeof tagValue === 'string') {
            const tagLower = tagValue.toLowerCase();
            if (tagLower === 'workaround') tagValue = 'Workaround';
            else if (tagLower === 'learning for the future project') tagValue = 'Learning for the future project';
          }
          setDesignInsightData({
            id: `#${found.id}`,
            category: found.category_name || '-',
            subCategory: found.sub_category_name || '-',
            zone: found.zone_name || '-',
            site: found.site_name || '-',
            location: found.sub_loc_name || '-',
            categorization: found.categorization || '-',
            mustHave: found.must_have ? 'Yes' : 'No',
            observation: found.observation || '-',
            recommendation: found.recommendation || '-',
            tag: tagValue,
            attachments: found.attachments || [],
          });
        }
      } catch (err) {
        setDesignInsightData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);


  const handleEdit = () => {
    setIsEditing(true);
    navigate(`/transitioning/design-insight/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      if (!baseUrl || !token || !id) throw new Error('Missing baseUrl, token, or id');
      const res = await fetch(`https://${baseUrl}/pms/design_inputs/${id}.json`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      navigate('/transitioning/design-insight');
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  if (loading) {
    return <div className="p-6 bg-white min-h-screen">Loading...</div>;
  }

  if (!designInsightData) {
    return <div className="p-6 bg-white min-h-screen">No data found.</div>;
  }

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
        <h1 className="font-['Work_Sans'] font-semibold text-[18px] leading-auto tracking-[0%] text-[#1A1A1A]">
          DESIGN INSIGHT DETAILS ({designInsightData.id})
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={handleEdit}
            className="bg-[#C72030] hover:bg-[#A61B28] text-white"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-[#e11d48] hover:bg-[#b91c1c] text-white"
            size="sm"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Design Details Section */}
      <Card className="mb-6">
        <CardHeader className="px-[50px] py-[50px]">
          <CardTitle className="text-[#1A1A1A] flex items-center gap-5 text-[18px] font-semibold leading-auto tracking-[0%] font-['Work_Sans']">
            <span className="bg-[#C72030] text-white rounded-full w-10 h-10 flex items-center justify-center text-[18px] font-semibold">⚙</span>
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
                <span className="text-sm font-medium text-gray-600">Location</span>
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
                <span className="ml-2">: {designInsightData.subCategory}</span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">Site</span>
                <span className="ml-2">: {designInsightData.site}</span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">Categorization</span>
                <span className="ml-2">: {designInsightData.categorization}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments Section */}
      <Card>
        <CardHeader className="px-[50px] py-[50px]">
          <CardTitle className="text-[#1A1A1A] flex items-center gap-5 text-[18px] font-semibold leading-auto tracking-[0%] font-['Work_Sans']">
            <span className="bg-[#C72030] text-white rounded-full w-10 h-10 flex items-center justify-center text-[18px] font-semibold">{designInsightData.attachments.length}</span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            {designInsightData.attachments.length === 0 && (
              <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center text-gray-400">No Attachments</div>
            )}
            {designInsightData.attachments.map((att: any) => (
              <a
                key={att.id}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-16 h-16 bg-gray-200 rounded border overflow-hidden"
                title={att.url}
              >
                {att.doctype && att.doctype.startsWith('image') ? (
                  <img src={att.url} alt="attachment" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">File</div>
                )}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignInsightDetailsDashboard;
