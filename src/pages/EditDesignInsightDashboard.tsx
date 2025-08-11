
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useNavigate } from 'react-router-dom';

export const EditDesignInsightDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [zone, setZone] = useState('');
  const [site, setSite] = useState('');
  const [location, setLocation] = useState('');
  const [categorization, setCategorization] = useState('');
  const [observation, setObservation] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [tag, setTag] = useState('');
  const [mustHave, setMustHave] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subCategories, setSubCategories] = useState<{ id: number; name: string; parent_id: number | null }[]>([]);
  const [siteList, setSiteList] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token || !id) return;
        const res = await fetch(`https://${baseUrl}/pms/design_inputs/${id}.json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setCategory(data.category_id ? String(data.category_id) : '');
        setSubCategory(data.sub_category_id ? String(data.sub_category_id) : '');
        setZone(data.zone_name || '');
        setSite(data.site_id ? String(data.site_id) : '');
        setLocation(data.sub_loc_name || '');
        // Normalize categorization to match SelectItem values
        let cat = (data.categorization || '').toLowerCase();
        if (cat === 'safety') setCategorization('safety');
        else if (cat === 'security') setCategorization('Security');
        else if (cat === 'customer experience') setCategorization('Customer Experience');
        else if (cat === 'cam') setCategorization('CAM');
        else setCategorization('');
        setObservation(data.observation || '');
        setRecommendation(data.recommendation || '');
        // Normalize tag to match dropdown options
        let tagValue = data.tag || '';
        if (typeof tagValue === 'string') {
          const tagLower = tagValue.toLowerCase();
          if (tagLower === 'workaround') tagValue = 'workaround';
          else if (tagLower === 'learning for the future project') tagValue = 'Learning for the future project';
        }
        setTag(tagValue);
        setMustHave(!!data.must_have);
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };

    // Fetch categories and subcategories
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

    // Fetch sites
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

    fetchCategories();
    fetchSites();
    fetchDetails();
  }, [id]);

  const handleSave = async () => {
    try {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      if (!baseUrl || !token || !id) throw new Error('Missing baseUrl, token, or id');

      const body = {
        id,
        category_id: category,
        sub_category_id: subCategory,
        site_id: site,
        sub_location_name: location,
        categorization,
        observation,
        recommendation,
        tag,
        must_have: mustHave ? 1 : 0,
      };

      const res = await fetch(`https://${baseUrl}/pms/design_inputs/${id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pms_design_input: body }),
      });
      const responseBody = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error('PUT error:', responseBody);
        throw new Error(responseBody?.error || 'Failed to update Design Insight');
      }
      // Optionally show a toast here
      navigate(`/transitioning/design-insight/details/${id}`);
    } catch (err) {
      // Optionally show a toast here
      alert(err.message || 'Failed to update Design Insight');
    }
  };

  const handleCancel = () => {
    navigate(`/transitioning/design-insight/details/${id}`);
  };

  const handleMustHaveChange = (checked: boolean | "indeterminate") => {
    setMustHave(checked === true);
  };

  if (loading) {
    return <div className="p-6 bg-white min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Design Insight {'>'} Edit Design Insight</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">EDIT DESIGN INSIGHT (#{id})</h1>
      </div>

      {/* Basic Details Section */}
      <Card className="mb-6">
        <CardHeader className="bg-white">
          <CardTitle style={{ color: '#C72030' }} className="flex items-center gap-2">
            <span className="text-white rounded-full w-6 h-6 flex items-center justify-center text-sm" style={{ backgroundColor: '#C72030' }}>⚙</span>
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
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                  ))}
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
                  {subCategories
                    .filter((sc) => String(sc.parent_id) === category)
                    .map((sc) => (
                      <SelectItem key={sc.id} value={String(sc.id)}>{sc.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="zone" className="text-sm font-medium">
                Zone<span className="text-red-500">*</span>
              </Label>
              <Input
                id="zone"
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                placeholder="Enter Zone"
                className="mt-1"
              />
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
                  {siteList.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
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
                  {/* No SelectItem with empty value, use placeholder only */}
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Customer Experience">Customer Experience</SelectItem>
                  <SelectItem value="CAM">CAM</SelectItem>
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
                  <SelectItem value="Learning for the future project">Learning for the future project</SelectItem>
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
      {/* <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
            <span className="text-white rounded-full w-6 h-6 flex items-center justify-center text-sm" style={{ backgroundColor: '#C72030' }}>📎</span>
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
      </Card> */}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          onClick={handleSave}
          className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8"
        >
          Save
        </Button>
        <Button
          onClick={handleCancel}
          variant="outline"
          className="border-gray-300 text-gray-700 px-8"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditDesignInsightDashboard;
