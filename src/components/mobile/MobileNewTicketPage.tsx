import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft, Settings, QrCode, Sparkles, Wrench, Monitor,
  ShieldCheck, Plus, X, Wifi, Zap, Wind, Droplets
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ticketManagementAPI, CategoryResponse, SubCategoryResponse } from '@/services/ticketManagementAPI';
import { getUser } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';

const CATEGORY_ICON_LIST = [Sparkles, Wrench, Monitor, ShieldCheck, Wifi, Zap, Wind, Droplets];

const getCategoryIcon = (name: string, index: number) => {
  const lower = name.toLowerCase();
  if (lower.includes('house') || lower.includes('clean')) return Sparkles;
  if (lower.includes('tech') || lower.includes('maint') || lower.includes('mechanic')) return Wrench;
  if (lower.includes('it') || lower.includes('computer') || lower.includes('network')) return Monitor;
  if (lower.includes('safe') || lower.includes('secur') || lower.includes('fire')) return ShieldCheck;
  if (lower.includes('wifi') || lower.includes('internet') || lower.includes('telecom')) return Wifi;
  if (lower.includes('electric') || lower.includes('power')) return Zap;
  if (lower.includes('air') || lower.includes('hvac') || lower.includes('ac')) return Wind;
  if (lower.includes('plumb') || lower.includes('water') || lower.includes('sanit')) return Droplets;
  return CATEGORY_ICON_LIST[index % CATEGORY_ICON_LIST.length];
};

interface MobileNewTicketPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const MobileNewTicketPage: React.FC<MobileNewTicketPageProps> = ({ onBack, onSuccess }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = getUser();

  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstname || ''} ${user.lastname || ''}`.trim() : '',
    employeeId: user?.id ? `EMP-${String(user.id).padStart(4, '0')}` : 'EMP-0000',
    contactNumber: user?.mobile || user?.phone || '',
    category: '',
    categoryName: '',
    subCategory: '',
    description: '',
    building: 'Nizwa Grand Mall',
    wing: '',
    floor: '',
    area: '',
    room: '',
  });

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategoryResponse[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoadingCategories(true);
      try {
        const res = await ticketManagementAPI.getCategories();
        setCategories(res.helpdesk_categories || []);
      } catch {
        /* silent */
      } finally {
        setLoadingCategories(false);
      }
    };
    load();
  }, []);

  const handleCategorySelect = useCallback(async (id: string, name: string) => {
    setFormData(prev => ({ ...prev, category: id, categoryName: name, subCategory: '' }));
    setSubcategories([]);
    setLoadingSubcategories(true);
    try {
      const subs = await ticketManagementAPI.getSubCategoriesByCategory(parseInt(id));
      setSubcategories(subs);
    } catch {
      /* silent */
    } finally {
      setLoadingSubcategories(false);
    }
  }, []);

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => {
      const slots = 5 - prev.length;
      return [...prev, ...files.slice(0, slots)];
    });
    e.target.value = '';
  };

  const handleSubmit = async () => {
    if (!formData.category) {
      toast({ title: 'Validation Error', description: 'Please select a category', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const siteId = parseInt(localStorage.getItem('siteId') || '2189');
      const ticketData = {
        of_phase: 'pms',
        site_id: siteId,
        on_behalf_of: 'admin',
        complaint_type: 'request',
        category_type_id: parseInt(formData.category),
        heading: formData.description || formData.categoryName,
        complaint_mode_id: 75,
        room_id: 1,
        wing_id: 1,
        area_id: 1,
        floor_id: 1,
        priority: 'P3',
        society_staff_type: 'User',
        proactive_reactive: 'reactive',
        ...(user?.id && { id_user: user.id }),
        ...(formData.subCategory && { sub_category_id: parseInt(formData.subCategory) }),
      };

      await ticketManagementAPI.createTicket(ticketData, attachments);
      toast({ title: 'Success', description: 'Ticket submitted successfully!' });
      onSuccess();
    } catch {
      toast({ title: 'Error', description: 'Failed to submit ticket. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof formData, val: string) =>
    setFormData(prev => ({ ...prev, [key]: val }));

  return (
    /*
     * Mobile  : full-screen flex column, inner div scrolls, button sticks via sticky
     * Desktop : normal page flow, content capped at max-w-3xl, centred
     */
    <div
      className="flex flex-col h-screen md:h-auto md:min-h-screen"
      style={{ backgroundColor: '#f6f4ee' }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm flex-shrink-0 md:sticky md:top-0 md:z-10 md:px-8">
        <button onClick={onBack} className="p-1 rounded-lg active:bg-gray-100">
          <ArrowLeft className="h-6 w-6" style={{ color: '#2c2c2c' }} />
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#da7756' }}
          >
            <QrCode className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-semibold" style={{ color: '#2c2c2c' }}>New Ticket</h1>
        </div>
        <button className="p-1 rounded-lg active:bg-gray-100">
          <Settings className="h-6 w-6" style={{ color: '#2c2c2c' }} />
        </button>
      </div>

      {/* ── Scrollable body ────────────────────────────────────── */}
      {/*
       * Mobile  : flex-1 overflow-y-auto keeps content scrollable inside h-screen
       * Desktop : overflow visible, page itself scrolls
       */}
      <div className="flex-1 overflow-y-auto md:flex-none md:overflow-visible">
        {/* Centred content column on desktop */}
        <div className="md:max-w-3xl md:mx-auto md:px-4 md:py-6 pb-6">

          {/* Scanned Location */}
          <div
            className="mx-4 mt-4 md:mx-0 rounded-xl p-4 flex items-center gap-3"
            style={{ backgroundColor: '#dce8f5' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#da7756' }}
            >
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: '#5a7a9a' }}>Scanned Location</p>
              <p className="text-base font-semibold" style={{ color: '#2c2c2c' }}>{formData.building}</p>
            </div>
          </div>

          {/* Requester Details */}
          <div className="mx-4 mt-4 md:mx-0 bg-white rounded-xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm" style={{ color: '#da7756' }}>&#9432;</span>
              <span className="text-base font-semibold" style={{ color: '#2c2c2c' }}>Requester Details</span>
            </div>

            <div className="mb-3">
              <label className="text-xs font-medium mb-1 block" style={{ color: '#2c2c2c' }}>
                Full Name <span style={{ color: '#da7756' }}>*</span>
              </label>
              <Input
                placeholder="e.g. Khalid Al-Rashidi"
                value={formData.fullName}
                onChange={e => field('fullName', e.target.value)}
                className="h-10 rounded-lg text-sm md:h-11"
                style={{ borderColor: '#d3d1c7' }}
              />
            </div>

            {/* 2-col on all sizes */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: '#2c2c2c' }}>Employee ID</label>
                <Input
                  value={formData.employeeId}
                  onChange={e => field('employeeId', e.target.value)}
                  placeholder="EMP-0000"
                  className="h-10 rounded-lg text-sm md:h-11"
                  style={{ borderColor: '#d3d1c7' }}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: '#2c2c2c' }}>Contact Number</label>
                <Input
                  value={formData.contactNumber}
                  onChange={e => field('contactNumber', e.target.value)}
                  placeholder="+968 9XXX XXXX"
                  className="h-10 rounded-lg text-sm md:h-11"
                  style={{ borderColor: '#d3d1c7' }}
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="mx-4 mt-4 md:mx-0 bg-white rounded-xl p-4 md:p-6">
            <p className="text-base font-semibold mb-3" style={{ color: '#2c2c2c' }}>
              Category <span style={{ color: '#da7756' }}>*</span>
            </p>

            {loadingCategories ? (
              <div className="text-center py-6 text-sm" style={{ color: '#888780' }}>Loading categories…</div>
            ) : (
              /* 2 cols on mobile → 4 cols on desktop */
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.slice(0, 8).map((cat, idx) => {
                  const Icon = getCategoryIcon(cat.name, idx);
                  const selected = formData.category === cat.id.toString();
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id.toString(), cat.name)}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all active:scale-95 hover:shadow-sm"
                      style={{
                        borderColor: selected ? '#da7756' : '#e8e4dc',
                        backgroundColor: selected ? 'rgba(218,119,86,0.08)' : '#fff',
                      }}
                    >
                      <Icon className="h-7 w-7" style={{ color: selected ? '#da7756' : '#888780' }} />
                      <span
                        className="text-xs font-medium text-center leading-tight"
                        style={{ color: selected ? '#da7756' : '#2c2c2c' }}
                      >
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Subcategory */}
          <div className="mx-4 mt-4 md:mx-0 bg-white rounded-xl p-4 md:p-6">
            <label className="text-base font-semibold mb-3 block" style={{ color: '#2c2c2c' }}>
              Subcategory <span style={{ color: '#da7756' }}>*</span>
            </label>
            <Select
              value={formData.subCategory}
              onValueChange={val => field('subCategory', val)}
              disabled={!formData.category || loadingSubcategories}
            >
              <SelectTrigger className="h-11 rounded-lg text-sm" style={{ borderColor: '#d3d1c7' }}>
                <SelectValue
                  placeholder={
                    !formData.category
                      ? 'Select a category first'
                      : loadingSubcategories
                      ? 'Loading…'
                      : 'Select subcategory'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map(sub => (
                  <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="mx-4 mt-4 md:mx-0 bg-white rounded-xl p-4 md:p-6">
            <label className="text-base font-semibold mb-1 block" style={{ color: '#2c2c2c' }}>
              Description
            </label>
            <Textarea
              placeholder="Describe the issue in detail — what happened, when it started, any relevant observations..."
              value={formData.description}
              onChange={e => field('description', e.target.value)}
              rows={4}
              className="resize-none rounded-lg text-sm mt-2"
              style={{ borderColor: '#d3d1c7' }}
            />
            <p className="text-xs mt-2" style={{ color: '#888780' }}>
              Optional but helps our team respond faster
            </p>
          </div>

          {/* Attachments */}
          <div className="mx-4 mt-4 md:mx-0 bg-white rounded-xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base font-semibold" style={{ color: '#2c2c2c' }}>Attachments</span>
              <span className="text-sm" style={{ color: '#888780' }}>Optional</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, i) => (
                <div
                  key={i}
                  className="relative w-16 h-16 rounded-lg border flex items-center justify-center"
                  style={{ borderColor: '#c4b89d', backgroundColor: '#f6f4ee' }}
                >
                  <span className="text-xs text-center px-1 line-clamp-2 break-all" style={{ color: '#2c2c2c' }}>
                    {file.name.length > 8 ? file.name.slice(0, 7) + '…' : file.name}
                  </span>
                  <button
                    onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#da7756' }}
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              {attachments.length < 5 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 active:bg-gray-50 hover:bg-gray-50"
                  style={{ borderColor: '#c4b89d' }}
                >
                  <Plus className="h-5 w-5" style={{ color: '#888780' }} />
                  <span className="text-xs" style={{ color: '#888780' }}>Add</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileAdd}
              className="hidden"
            />
            <p className="text-xs mt-2" style={{ color: '#888780' }}>
              JPEG, PNG, PDF up to 10MB each · Max 5 files
            </p>
          </div>

          {/* Location */}
          <div className="mx-4 mt-4 md:mx-0 bg-white rounded-xl p-4 md:p-6">
            <p className="text-base font-semibold mb-3" style={{ color: '#2c2c2c' }}>
              Location <span style={{ color: '#da7756' }}>*</span>
            </p>

            <div className="mb-3">
              <label className="text-xs font-medium mb-1 block" style={{ color: '#888780' }}>Building</label>
              <Select value={formData.building} onValueChange={val => field('building', val)}>
                <SelectTrigger className="h-11 rounded-lg text-sm" style={{ borderColor: '#d3d1c7' }}>
                  <SelectValue placeholder="Select Building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nizwa Grand Mall">Nizwa Grand Mall</SelectItem>
                  <SelectItem value="Building A">Building A</SelectItem>
                  <SelectItem value="Building B">Building B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Wing + Floor: 2-col on mobile, 4-col on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="md:col-span-2">
                <label className="text-xs font-medium mb-1 block" style={{ color: '#888780' }}>Wing</label>
                <Select value={formData.wing} onValueChange={val => field('wing', val)}>
                  <SelectTrigger className="h-11 rounded-lg text-sm" style={{ borderColor: '#d3d1c7' }}>
                    <SelectValue placeholder="Select Wing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North Wing</SelectItem>
                    <SelectItem value="south">South Wing</SelectItem>
                    <SelectItem value="east">East Wing</SelectItem>
                    <SelectItem value="west">West Wing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium mb-1 block" style={{ color: '#888780' }}>Floor</label>
                <Select value={formData.floor} onValueChange={val => field('floor', val)}>
                  <SelectTrigger className="h-11 rounded-lg text-sm" style={{ borderColor: '#d3d1c7' }}>
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">Ground Floor</SelectItem>
                    <SelectItem value="1">1st Floor</SelectItem>
                    <SelectItem value="2">2nd Floor</SelectItem>
                    <SelectItem value="3">3rd Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Area + Room: same */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="text-xs font-medium mb-1 block" style={{ color: '#888780' }}>Area</label>
                <Select value={formData.area} onValueChange={val => field('area', val)}>
                  <SelectTrigger className="h-11 rounded-lg text-sm" style={{ borderColor: '#d3d1c7' }}>
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lobby">Lobby</SelectItem>
                    <SelectItem value="corridor">Corridor</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="parking">Parking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium mb-1 block" style={{ color: '#888780' }}>Room</label>
                <Select value={formData.room} onValueChange={val => field('room', val)}>
                  <SelectTrigger className="h-11 rounded-lg text-sm" style={{ borderColor: '#d3d1c7' }}>
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room101">Room 101</SelectItem>
                    <SelectItem value="room102">Room 102</SelectItem>
                    <SelectItem value="room103">Room 103</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <p className="mx-4 mt-3 md:mx-0 text-xs" style={{ color: '#888780' }}>* Required fields</p>

          {/* ── Submit button – desktop: inline block at bottom of content ── */}
          <div
            className="hidden md:block mt-6 mb-2"
          >
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-base text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#da7756' }}
            >
              <span>{loading ? 'Submitting…' : 'Submit Request'}</span>
              {!loading && <span className="text-lg">›</span>}
            </button>
          </div>

        </div>{/* /centred column */}
      </div>{/* /scrollable body */}

      {/* ── Submit button – mobile only: sticky to bottom of scroll container ── */}
      <div
        className="md:hidden sticky bottom-0 left-0 right-0 px-4 py-4 bg-white border-t flex-shrink-0"
        style={{ borderColor: '#e8e4dc' }}
      >
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-xl font-semibold text-base text-white flex items-center justify-center gap-2 transition-opacity active:opacity-80 disabled:opacity-60"
          style={{ backgroundColor: '#da7756' }}
        >
          <span>{loading ? 'Submitting…' : 'Submit Request'}</span>
          {!loading && <span className="text-lg">›</span>}
        </button>
      </div>
    </div>
  );
};
