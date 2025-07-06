
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';

export const AddDesignInsightDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [site, setSite] = useState('');
  const [location, setLocation] = useState('');
  const [categorization, setCategorization] = useState('');
  const [observation, setObservation] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [tag, setTag] = useState('');
  const [mustHave, setMustHave] = useState(false);

  const handleSave = () => {
    console.log('Design Insight saved:', {
      category,
      subCategory,
      site,
      location,
      categorization,
      observation,
      recommendation,
      tag,
      mustHave
    });
    toast({
      title: "Success",
      description: "Design Insight saved successfully!",
    });
    // Navigate back to Design Insight list using React Router
    navigate('/transitioning/design-insight');
  };

  const handleBack = () => {
    // Navigate back to Design Insight list using React Router
    navigate('/transitioning/design-insight');
  };

  const handleMustHaveChange = (checked: boolean | "indeterminate") => {
    setMustHave(checked === true);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Design Insight &gt; NEW Design Insight</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-['Work_Sans'] font-semibold text-[18px] leading-auto tracking-[0%] text-[#1A1A1A]">
          NEW DESIGN INSIGHT
        </h1>
      </div>

      {/* Basic Details Section */}
      <Card className="mb-6">
        <CardHeader className="px-[50px] py-[50px]">
          <CardTitle className="text-[#1A1A1A] flex items-center gap-5 text-[18px] font-semibold leading-auto tracking-[0%] font-['Work_Sans']">
            <span className="bg-[#C72030] text-white rounded-full w-10 h-10 flex items-center justify-center text-[18px] font-semibold">⚙</span>
            DESIGN DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Category<span className="text-red-500">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landscape">Landscape</SelectItem>
                  <SelectItem value="facade">Façade</SelectItem>
                  <SelectItem value="security">Security & surveillance</SelectItem>
                  <SelectItem value="inside-units">Inside Units</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subCategory" className="text-sm font-medium">Sub-category</Label>
              <Select value={subCategory} onValueChange={setSubCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="access-control">Access Control</SelectItem>
                  <SelectItem value="cctv">CCTV</SelectItem>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="entry-exit">Entry-Exit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="site" className="text-sm font-medium">
                Site<span className="text-red-500">*</span>
              </Label>
              <Select value={site} onValueChange={setSite}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lockated">Lockated</SelectItem>
                  <SelectItem value="godrej-prime">Godrej Prime,Gurgaon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium">
                Location<span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter Location"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="categorization" className="text-sm font-medium">
                Categorization<span className="text-red-500">*</span>
              </Label>
              <Select value={categorization} onValueChange={setCategorization}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Categorization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="workaround">Workaround</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tag" className="text-sm font-medium">Tag</Label>
              <Select value={tag} onValueChange={setTag}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workaround">Workaround</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <Label htmlFor="observation" className="text-sm font-medium">
                Observation<span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="observation"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Enter Observation"
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="recommendation" className="text-sm font-medium">
                Recommendation<span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="recommendation"
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                placeholder="Enter Recommendation"
                className="mt-1"
                rows={4}
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mustHave" 
                checked={mustHave}
                onCheckedChange={handleMustHaveChange}
              />
              <Label htmlFor="mustHave" className="text-sm font-medium">
                Must Have
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments Section */}
      <Card className="mb-6">
        <CardHeader className="px-[50px] py-[50px]">
          <CardTitle className="text-[#1A1A1A] flex items-center gap-5 text-[18px] font-semibold leading-auto tracking-[0%] font-['Work_Sans']">
            <span className="bg-[#C72030] text-white rounded-full w-10 h-10 flex items-center justify-center text-[18px] font-semibold">0</span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div>
            <Label className="text-sm font-medium">Manuals Upload</Label>
            <div className="mt-2 border-2 border-dashed border-orange-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                Drag & Drop or <span className="text-orange-600 cursor-pointer">Choose File</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">No file chosen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button 
          onClick={handleSave}
          className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8"
        >
          Save
        </Button>
        <Button 
          onClick={handleBack}
          variant="outline"
          className="border-gray-300 text-gray-700 px-8"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default AddDesignInsightDashboard;
