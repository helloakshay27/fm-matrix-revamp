
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BasicDetailsSection } from '@/components/BasicDetailsSection';
import { FormActionBar } from '@/components/common/FormSection';
import { ArrowLeft } from 'lucide-react';


export const AddDesignInsightDashboard = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subCategories, setSubCategories] = useState<{ id: number; name: string; parent_id: number | null }[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        const res = await fetch(`https://${baseUrl}/pms/design_input_tags.json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        const cats = (data.data || []).filter((item: any) => item.parent_id === null && item.tag_type === 'DesignInputCategory');
        const subCats = (data.data || []).filter((item: any) => item.parent_id !== null && item.tag_type === 'DesignInputsSubCategory');
        setCategories(cats.map((c: any) => ({ id: c.id, name: c.name })));
        setSubCategories(subCats.map((sc: any) => ({ id: sc.id, name: sc.name, parent_id: sc.parent_id })));
      } catch (err) {
        setCategories([]);
        setSubCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const [site, setSite] = useState('');
  const [location, setLocation] = useState('');
  const [categorization, setCategorization] = useState('');
  const [observation, setObservation] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [tag, setTag] = useState('');
  const [mustHave, setMustHave] = useState(false);
  const [siteList, setSiteList] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) return;
        const res = await fetch(`https://${baseUrl}/sitelist.json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch sites');
        const data = await res.json();
        setSiteList(data.sites || []);
      } catch (err) {
        setSiteList([]);
      }
    };
    fetchSites();
  }, []);

  const onAttachmentsChange = (files: File[]) => {
    setAttachments(files);
  };

  const handleSave = async () => {
    console.log("clicked")
    try {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      if (!baseUrl || !token) throw new Error('Missing baseUrl or token');

      const formData = new FormData();
      formData.append('pms_design_input[category_id]', category);
      formData.append('pms_design_input[sub_category_id]', subCategory);
      formData.append('pms_design_input[sub_location_name]', location);
      formData.append('pms_design_input[categorization]', categorization);
      formData.append('pms_design_input[observation]', observation);
      formData.append('pms_design_input[recommendation]', recommendation);
      formData.append('pms_design_input[tag]', tag);
      formData.append('pms_design_input[must_have]', mustHave ? '1' : '0');
      formData.append('pms_design_input[site_id]', site);
      // Append attachments
      attachments.forEach((file) => {
        formData.append('designinput[]', file);
      });

      const res = await fetch(`https://${baseUrl}/pms/design_inputs.json`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const responseBody = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error('POST error:', responseBody);
        throw new Error(responseBody?.error || 'Failed to save Design Insight');
      }
      console.log('POST success:', responseBody);
      toast.success('Design Insight saved successfully!');
      navigate('/transitioning/design-insight');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save Design Insight');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleMustHaveChange = (checked: boolean | "indeterminate") => {
    setMustHave(checked === true);
  };

  return (
    <div className="p-4 sm:p-6 max-w-full mx-auto min-h-screen bg-gray-50">
      {/* Header — Add Asset page jaisa */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Design Insights</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">New Design Insight</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">NEW DESIGN INSIGHT</h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
      {/* Basic Details + Attachments Sections */}
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
        siteList={siteList}
        categories={categories}
        subCategories={subCategories}
        attachments={attachments}
        onAttachmentsChange={onAttachmentsChange}
      />
      </div>
      <FormActionBar onSubmit={handleSave} onCancel={handleBack} submitLabel="Save" />
    </div>
  );
};

export default AddDesignInsightDashboard;
