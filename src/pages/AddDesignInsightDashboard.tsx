
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { BasicDetailsSection } from '@/components/BasicDetailsSection';
import { AttachmentsSection } from '@/components/AttachmentsSection';
import { ActionButtons } from '@/components/ActionButtons';

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
    navigate('/transitioning/design-insight');
  };

  const handleBack = () => {
    navigate('/transitioning/design-insight');
  };

  const handleMustHaveChange = (checked: boolean | "indeterminate") => {
    setMustHave(checked === true);
  };

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-600 mb-2 text-sm">Design Insight &gt; NEW Design Insight</p>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] uppercase">NEW DESIGN INSIGHT</h1>
      </div>

      {/* Basic Details Section */}
      <BasicDetailsSection
        category={category}
        setCategory={setCategory}
        subCategory={subCategory}
        setSubCategory={setSubCategory}
        site={site}
        setSite={setSite}
        location={location}
        setLocation={setLocation}
        categorization={categorization}
        setCategorization={setCategorization}
        observation={observation}
        setObservation={setObservation}
        recommendation={recommendation}
        setRecommendation={setRecommendation}
        tag={tag}
        setTag={setTag}
        mustHave={mustHave}
        handleMustHaveChange={handleMustHaveChange}
      />

      {/* Attachments Section */}
      <AttachmentsSection />

      {/* Action Buttons */}
      <ActionButtons onSave={handleSave} onBack={handleBack} />
    </div>
  );
};

export default AddDesignInsightDashboard;
