import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Star, 
  Image as ImageIcon,
  X,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

interface IconFormData {
  id: number;
  name: string;
  description: string;
  category: string;
  iconFile: File | null;
  currentIconPath: string;
  isActive: boolean;
  tags: string[];
  createdDate: string;
  usageCount: number;
}

export const EditIconPage: React.FC = () => {
  const { iconId } = useParams<{ iconId: string }>();
  const [formData, setFormData] = useState<IconFormData | null>(null);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const categories = [
    'User',
    'Navigation',
    'System',
    'Analytics',
    'Communication',
    'Actions',
    'Status',
    'Misc'
  ];

  // Load icon data
  useEffect(() => {
    const loadIconData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call to load icon data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for the icon being edited
        const mockIconData: IconFormData = {
          id: parseInt(iconId || '1'),
          name: 'User Profile',
          description: 'Default user profile icon for the application',
          category: 'User',
          iconFile: null,
          currentIconPath: '/icons/user-profile.svg',
          isActive: true,
          tags: ['profile', 'user', 'avatar'],
          createdDate: '2024-01-15',
          usageCount: 245
        };
        
        setFormData(mockIconData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load icon data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (iconId) {
      loadIconData();
    }
  }, [iconId, toast]);

  const handleInputChange = (field: keyof IconFormData, value: any) => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      [field]: value
    }) : null);
  };

  const handleFileUpload = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an SVG, PNG, JPEG, or GIF file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 2MB.",
        variant: "destructive"
      });
      return;
    }

    handleInputChange('iconFile', file);
    toast({
      title: "File Uploaded",
      description: `${file.name} has been uploaded successfully.`
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const addTag = () => {
    if (!formData) return;
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (!formData) return;
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Icon name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Please select a category.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success",
        description: "Icon has been updated successfully."
      });

      // Redirect to icons dashboard
      window.location.href = '/security/visitor-management/icons';
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update icon. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!formData) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${formData.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success",
        description: "Icon has been deleted successfully."
      });

      // Redirect to icons dashboard
      window.location.href = '/security/visitor-management/icons';
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete icon. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/security/visitor-management/icons';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading icon data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Icon Not Found</h3>
              <p className="text-gray-500 mb-4">The requested icon could not be found.</p>
              <Button onClick={handleCancel}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Icons
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancel}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C72030] rounded-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Edit Icon</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Update icon details and settings</p>
                </div>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Icon
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Icon Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Created Date</p>
              <p className="text-lg font-bold text-blue-600">
                {new Date(formData.createdDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Usage Count</p>
              <p className="text-lg font-bold text-green-600">{formData.usageCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className={`text-lg font-bold ${formData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Icon Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter icon name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter icon description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Active Status</Label>
            </div>
          </CardContent>
        </Card>

        {/* Current Icon */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Current Icon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-white rounded border border-gray-200 flex items-center justify-center">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Current Icon File</p>
                <p className="text-sm text-gray-500">{formData.currentIconPath}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Update Icon File</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-[#C72030] bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.iconFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="p-4 bg-green-50 rounded-full">
                      <ImageIcon className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{formData.iconFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(formData.iconFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('iconFile', null)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="p-4 bg-gray-50 rounded-full">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Drop a new icon file here</p>
                    <p className="text-sm text-gray-500">or click to browse (optional)</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept="image/svg+xml,image/png,image/jpeg,image/gif"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <AlertCircle className="w-4 h-4" />
              <span>Supported formats: SVG, PNG, JPEG, GIF (max 2MB)</span>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#C72030] hover:bg-[#A01B28] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Icon
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
