import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Box, Loader2, Layers, FolderOpen } from 'lucide-react';
import { API_CONFIG, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { fetchAssetTypes } from '@/services/assetTypesAPI';

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuestionValue {
  label: string;
  value?: string;
  type?: 'positive' | 'negative';
}

interface Question {
  label: string;
  type: string;
  subtype?: string | null;
  required?: string;
  is_reading?: string;
  weightage?: string;
  rating_enabled?: boolean | string;
  consumption_type?: string;
  consumption_unit_type?: number | string | null;
  question_hint?: string | null;
  hint?: string | null;                  // alias used in content[] responses
  question_hint_image_url?: { id: number; filename: string; url: string }[];
  values?: QuestionValue[];
  // present in flat content[] responses
  group_id?: string;
  sub_group_id?: string;
  name?: string;
}

interface SubGroup {
  sub_group_id: number;
  sub_group_name: string;
  questions: Question[];
}

interface ChecklistGroup {
  group_id: number;
  group_name: string;
  sub_groups: SubGroup[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  text: 'Text Input',
  number: 'Number Input',
  textarea: 'Multi-line Text',
  date: 'Date',
  'radio-group': 'Radio Buttons',
  'checkbox-group': 'Checkboxes',
  select: 'Dropdown',
};

const getTypeLabel = (type: string, subtype?: string | null) => {
  if (type === 'select' && subtype === 'input') return 'Dropdown with Input';
  return TYPE_LABELS[type] ?? type;
};

// Groups a flat content[] (which embeds group_id / sub_group_id per question)
// into an ordered list of { groupId, subGroups: { subGroupId, questions }[] }
const groupContentQuestions = (content: Question[]) => {
  const groupOrder: string[] = [];
  const groupMap: Record<string, { sgOrder: string[]; sgMap: Record<string, Question[]> }> = {};

  content.forEach((q) => {
    const gid = q.group_id ?? '';
    const sgid = q.sub_group_id ?? '';

    if (!groupMap[gid]) {
      groupOrder.push(gid);
      groupMap[gid] = { sgOrder: [], sgMap: {} };
    }
    const g = groupMap[gid];
    if (!g.sgMap[sgid]) {
      g.sgOrder.push(sgid);
      g.sgMap[sgid] = [];
    }
    g.sgMap[sgid].push(q);
  });

  return groupOrder.map((gid, gi) => ({
    groupId: gid,
    groupIndex: gi + 1,
    subGroups: groupMap[gid].sgOrder.map((sgid, si) => ({
      subGroupId: sgid,
      subGroupIndex: si + 1,
      questions: groupMap[gid].sgMap[sgid],
    })),
  }));
};

// ─── QuestionCard ─────────────────────────────────────────────────────────────

const QuestionCard = ({
  question,
  index,
  weightageEnabled,
}: {
  question: Question;
  index: number;
  weightageEnabled?: boolean;
}) => {
  const hasOptions =
    Array.isArray(question.values) && question.values.length > 0;
  const hasHintImages =
    Array.isArray(question.question_hint_image_url) &&
    question.question_hint_image_url.length > 0;
  const hintText = question.question_hint || question.hint || null;
  const consumptionType = question.consumption_type || null;

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      {/* Label row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-medium text-gray-900 text-sm">
          {index + 1}. {question.label || '--'}
        </h4>
        <div className="flex items-center gap-1 shrink-0">
          {question.required === 'true' && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              Required
            </span>
          )}
          {question.is_reading === 'true' && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Reading
            </span>
          )}
          {(question.rating_enabled === true ||
            question.rating_enabled === 'true') && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
              Rating
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
        <div className="flex items-start">
          <span className="text-gray-500 min-w-[120px]">Type</span>
          <span className="text-gray-500 mx-2">:</span>
          <span className="text-gray-800 font-medium">
            {getTypeLabel(question.type, question.subtype)}
          </span>
        </div>

        {weightageEnabled && question.weightage && (
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[120px]">Weightage</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-800 font-medium">{question.weightage}</span>
          </div>
        )}

        {question.type === 'number' && consumptionType && (
          <div className="flex items-start">
            <span className="text-gray-500 min-w-[120px]">Consumption</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-800 font-medium capitalize">
              {consumptionType}
              {question.consumption_unit_type != null &&
              question.consumption_unit_type !== ''
                ? ` (Unit ${question.consumption_unit_type})`
                : ''}
            </span>
          </div>
        )}

        {hintText && (
          <div className="flex items-start col-span-2">
            <span className="text-gray-500 min-w-[120px]">Hint</span>
            <span className="text-gray-500 mx-2">:</span>
            <span className="text-gray-800 font-medium">{hintText}</span>
          </div>
        )}
      </div>

      {/* Options */}
      {hasOptions && (
        <div className="mt-3">
          <span className="text-xs text-gray-500 font-medium block mb-1">
            Options:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {question.values!.map((v, vi) => (
              <span
                key={vi}
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  v.type === 'positive'
                    ? 'bg-green-100 text-green-700'
                    : v.type === 'negative'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {v.label}
                {v.type ? ` (${v.type === 'positive' ? 'P' : 'N'})` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hint images */}
      {hasHintImages && (
        <div className="mt-3 flex flex-wrap gap-2">
          {question.question_hint_image_url!.map((img) => (
            <a
              key={img.id}
              href={img.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={img.url}
                alt={img.filename}
                className="h-14 w-14 object-cover rounded border border-gray-200"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export const ViewChecklistMasterPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [checklistData, setChecklistData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  // Fetch asset types data from API
  const {
    data: assetTypes,
    isLoading: isLoadingAssetTypes,
    error: assetTypesError
  } = useQuery({
    queryKey: ['asset-types'],
    queryFn: fetchAssetTypes
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const fetchChecklist = async () => {
      try {
        const url = `${API_CONFIG.BASE_URL}/master_checklist_detail.json?id=${id}`;
        const response = await fetch(url, getAuthenticatedFetchOptions('GET'));
        if (!response.ok) {
          throw new Error('Failed to fetch checklist details');
        }
        const data = await response.json();
        setChecklistData(data);
      } catch (err) {
        setError(err.message || 'Error fetching checklist details');
        setChecklistData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchChecklist();
  }, [id]);

  const handleEditDetails = () => {
    navigate(`/master/checklist-master/edit/${id}`);
  };

  // Format date function
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!checklistData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading checklist details...</span>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-gray-500">No checklist details found.</p>
          )}
        </div>
      </div>
    );
  }

  // Get asset type name from ID
  const getAssetTypeName = (assetTypeId: number) => {
    if (!assetTypes || !assetTypeId) return '';
    const assetType = assetTypes.find(type => type.id === assetTypeId);
    return assetType ? assetType.name : '';
  };

  // Parse schedule for from checklist_for
  const getScheduleFor = (checklistFor: string) => {
    if (!checklistFor) return '';
    const parts = checklistFor.split('::');
    if (parts.length > 1) {
      const scheduleForPart = parts[1].toLowerCase();
      if (scheduleForPart.includes('asset')) {
        return 'Asset';
      } else if (scheduleForPart.includes('service')) {
        return 'Service';
      } else if (scheduleForPart.includes('vendor')) {
        return 'Vendor';
      } else if (scheduleForPart.includes('amc')) {
        return 'AMC';
      }
    }
    return '';
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/master/checklist')}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Checklist Master
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                {checklistData.form_name || 'Checklist Master'}
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              ID: {checklistData.id || '--'} • Type: {checklistData.schedule_type || '--'} • Schedule For: {getScheduleFor(checklistData.checklist_for) || '--'} • Created: {formatDate(checklistData.created_at)}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleEditDetails}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              Edit Details
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="basic" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
            <TabsTrigger
              value="basic"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Basic Information
            </TabsTrigger>

            <TabsTrigger
              value="tasks"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Tasks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Basic Information Card */}
              <Card className="w-full">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                    <span className="uppercase tracking-wide">Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Type</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{checklistData.schedule_type || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Schedule For</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{getScheduleFor(checklistData.checklist_for) || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Form Name</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{checklistData.form_name || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Create Ticket</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{checklistData.create_ticket ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Ticket Level</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{checklistData.ticket_level || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Company ID</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{checklistData.company_id || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Created At</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{formatDate(checklistData.created_at)}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Updated At</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{formatDate(checklistData.updated_at)}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Weightage Enabled</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{checklistData.weightage_enabled ? 'Yes' : 'No'}</span>
                    </div>
                    {getScheduleFor(checklistData.checklist_for) === 'Asset' && checklistData.asset_meter_type_id && (
                      <div className="flex items-start">
                        <span className="text-gray-500 min-w-[140px]">Asset Type</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{getAssetTypeName(checklistData.asset_meter_type_id) || '--'}</span>
                      </div>
                    )}
                    {checklistData.description && (
                      <div className="flex items-start col-span-2">
                        <span className="text-gray-500 min-w-[140px]">Description</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{checklistData.description}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Tasks Card */}
              <Card className="w-full">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <Box className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                    <span className="uppercase tracking-wide">Task Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* ── Grouped questions ─────────────────────────────── */}
                  {Array.isArray(checklistData.checklist_groups) &&
                  checklistData.checklist_groups.length > 0 ? (
                    <div className="space-y-8">
                      {(checklistData.checklist_groups as ChecklistGroup[]).map(
                        (group) => (
                          <div key={group.group_id}>
                            {/* Group header */}
                            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#C72030]">
                              <Layers className="w-4 h-4 text-[#C72030]" />
                              <span className="font-semibold text-base text-gray-900 uppercase tracking-wide">
                                {group.group_name}
                              </span>
                            </div>

                            {group.sub_groups.map((sg) => (
                              <div key={sg.sub_group_id} className="mb-6 ml-2">
                                {/* Sub-group header */}
                                <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-300">
                                  <FolderOpen className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium text-sm text-gray-700">
                                    {sg.sub_group_name}
                                  </span>
                                </div>

                                <div className="space-y-3 ml-2">
                                  {sg.questions.map((q, qi) => (
                                    <QuestionCard
                                      key={qi}
                                      question={q}
                                      index={qi}
                                      weightageEnabled={
                                        checklistData.weightage_enabled
                                      }
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      )}

                      {/* ── Ungrouped questions ──────────────────────── */}
                      {Array.isArray(checklistData.ungrouped_questions) &&
                        checklistData.ungrouped_questions.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-300">
                              <span className="font-semibold text-base text-gray-700 uppercase tracking-wide">
                                Other Questions
                              </span>
                            </div>
                            <div className="space-y-3">
                              {(
                                checklistData.ungrouped_questions as Question[]
                              ).map((q, qi) => (
                                <QuestionCard
                                  key={qi}
                                  question={q}
                                  index={qi}
                                  weightageEnabled={
                                    checklistData.weightage_enabled
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  ) : Array.isArray(checklistData.ungrouped_questions) &&
                    checklistData.ungrouped_questions.length > 0 ? (
                    /* Only ungrouped questions, no groups */
                    <div className="space-y-3">
                      {(checklistData.ungrouped_questions as Question[]).map(
                        (q, qi) => (
                          <QuestionCard
                            key={qi}
                            question={q}
                            index={qi}
                            weightageEnabled={checklistData.weightage_enabled}
                          />
                        )
                      )}
                    </div>
                  ) : Array.isArray(checklistData.content) &&
                    checklistData.content.length > 0 ? (() => {
                    /* content[] with embedded group_id / sub_group_id */
                    const hasGroups = (checklistData.content as Question[]).some(
                      (q) => q.group_id
                    );

                    if (!hasGroups) {
                      return (
                        <div className="space-y-3">
                          {(checklistData.content as Question[]).map((q, qi) => (
                            <QuestionCard
                              key={qi}
                              question={q}
                              index={qi}
                              weightageEnabled={checklistData.weightage_enabled}
                            />
                          ))}
                        </div>
                      );
                    }

                    const grouped = groupContentQuestions(
                      checklistData.content as Question[]
                    );
                    return (
                      <div className="space-y-8">
                        {grouped.map((g) => (
                          <div key={g.groupId}>
                            {/* Group header */}
                            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#C72030]">
                              <Layers className="w-4 h-4 text-[#C72030]" />
                              <span className="font-semibold text-base text-gray-900 uppercase tracking-wide">
                                Group {g.groupIndex}
                              </span>
                            </div>

                            {g.subGroups.map((sg) => (
                              <div key={sg.subGroupId} className="mb-6 ml-2">
                                {/* Sub-group header */}
                                <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-300">
                                  <FolderOpen className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium text-sm text-gray-700">
                                    Sub Group {sg.subGroupIndex}
                                  </span>
                                </div>

                                <div className="space-y-3 ml-2">
                                  {sg.questions.map((q, qi) => (
                                    <QuestionCard
                                      key={qi}
                                      question={q}
                                      index={qi}
                                      weightageEnabled={
                                        checklistData.weightage_enabled
                                      }
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    );
                  })() : (
                    <div className="text-center text-gray-500 py-8">
                      No tasks found
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};