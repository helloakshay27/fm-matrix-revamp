
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Upload, Star } from 'lucide-react';
import { toast } from 'sonner';

export const SubmitTaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    washroom: 'Washroom - Ladies Washroom',
    floorCleanComment: '',
    floorCleanRating: 0,
    floorCleanAttachments: null as File | null,
    liftLobbyComment: '',
    liftLobbyRating: 0,
    liftLobbyAttachments: null as File | null,
    liftLobbyChecks: {
      dust: false,
      dryMop: false,
      wetMop: false,
      vacuum: false
    },
    generalComment: '',
    generalAttachments: null as File | null,
    uploadFile: null as File | null
  });

  const handleBack = () => {
    navigate(`/maintenance/task/details/${id}`);
  };

  const handleRatingClick = (section: 'floorClean' | 'liftLobby', rating: number) => {
    setFormData(prev => ({
      ...prev,
      [`${section}Rating`]: rating
    }));
  };

  const handleCheckboxChange = (check: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      liftLobbyChecks: {
        ...prev.liftLobbyChecks,
        [check]: checked
      }
    }));
  };

  const handleFileUpload = (section: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [section]: file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting task form:', formData);
    toast.success('Task submitted successfully!');
    navigate(`/maintenance/task/details/${id}`);
  };

  const renderStarRating = (section: 'floorClean' | 'liftLobby') => {
    const rating = formData[`${section}Rating` as keyof typeof formData] as number;
    return (
      <div className="flex gap-1 my-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 cursor-pointer ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => handleRatingClick(section, star)}
          />
        ))}
      </div>
    );
  };

  const renderFileUpload = (section: string, label: string) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => handleFileUpload(section, e.target.files?.[0] || null)}
          className="hidden"
          id={`upload-${section}`}
        />
        <label
          htmlFor={`upload-${section}`}
          className="cursor-pointer text-blue-600 hover:text-blue-800"
        >
          Click to upload or drag and drop
        </label>
        <p className="text-xs text-gray-500 mt-1">
          {formData[section as keyof typeof formData] as File | null ? 
            (formData[section as keyof typeof formData] as File).name : 
            'No file selected'
          }
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-[#C72030]">
            <ArrowLeft className="w-4 h-4" />
            <span>Task Details</span>
          </button>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Test Ladies washroom Checklists</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Name</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
              <p className="text-gray-800">{formData.washroom}</p>
            </div>
          </CardContent>
        </Card>

        {/* Question 1: Is Floor Clean? */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">1) Is Floor Clean ?</h3>
              
              <div>
                <label className="block text-sm text-gray-600 mb-2">Enter Comment</label>
                <Textarea
                  value={formData.floorCleanComment}
                  onChange={(e) => setFormData(prev => ({ ...prev, floorCleanComment: e.target.value }))}
                  placeholder="Enter your comment here..."
                  className="w-full"
                  rows={3}
                />
              </div>

              {renderStarRating('floorClean')}

              {renderFileUpload('floorCleanAttachments', 'Attachments')}
            </div>
          </CardContent>
        </Card>

        {/* Question 2: Lift is lobby */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">2) Lift is lobby?</h3>
              <p className="text-sm text-gray-600">Dust</p>
              
              <div>
                <label className="block text-sm text-gray-600 mb-2">Enter Comment</label>
                <Textarea
                  value={formData.liftLobbyComment}
                  onChange={(e) => setFormData(prev => ({ ...prev, liftLobbyComment: e.target.value }))}
                  placeholder="Enter your comment here..."
                  className="w-full"
                  rows={3}
                />
              </div>

              {renderStarRating('liftLobby')}

              {renderFileUpload('liftLobbyAttachments', 'Attachments')}
            </div>
          </CardContent>
        </Card>

        {/* Question 3: Lift is lobby with checkboxes */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">3) Lift is lobby?</h3>
              
              <div className="space-y-3">
                {Object.entries(formData.liftLobbyChecks).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => handleCheckboxChange(key, checked as boolean)}
                    />
                    <label htmlFor={key} className="text-sm text-gray-700 capitalize">
                      {key === 'dryMop' ? 'Dry mop' : key === 'wetMop' ? 'Wet mop' : key}
                    </label>
                  </div>
                ))}
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-2">Enter Comment</label>
                <Textarea
                  value={formData.generalComment}
                  onChange={(e) => setFormData(prev => ({ ...prev, generalComment: e.target.value }))}
                  placeholder="Enter your comment here..."
                  className="w-full"
                  rows={3}
                />
              </div>

              {renderFileUpload('generalAttachments', 'Attachments')}
            </div>
          </CardContent>
        </Card>

        {/* Upload File Section */}
        <Card>
          <CardContent className="pt-6">
            {renderFileUpload('uploadFile', 'Upload File')}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            style={{ backgroundColor: '#C72030' }}
            className="text-white px-8 py-2 hover:bg-[#C72030]/90"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
