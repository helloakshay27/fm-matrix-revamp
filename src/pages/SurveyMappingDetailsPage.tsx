import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { LocationSelectionPanel } from "@/components/LocationSelectionPanel";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, CheckCircle, XCircle, Edit, Trash2, List, MapPin, QrCode, Shield, Clock, Users, Calendar, Eye, Info, Download, Star, ChevronDown, FileText, LogsIcon, File, FileIcon, Radio } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { apiClient } from '@/utils/apiClient';
import { getAuthHeader, getFullUrl } from '@/config/apiConfig';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { QuestionMark } from '@mui/icons-material';
// Questions table item interface
interface QuestionsTableItem {
  qnumber: string;
  id: number;
  descr: string;
  qtype: string;
  options: SurveyQuestion;
  active: number;
  created_by: string;
  created_at: string;
}

interface QRCodeData {
  id: number;
  document_file_name: string;
  document_content_type: string;
  document_file_size: number;
  document_updated_at: string;
  relation: string;
  relation_id: number;
  active: boolean | null;
  created_at: string;
  updated_at: string;
  changed_by: string | null;
  added_from: string | null;
  comments: string | null;
}

interface SurveyMapping {
  id: number;
  survey_id: number;
  created_by_id: number;
  site_id: number;
  building_id: number;
  wing_id: number | null;
  floor_id: number | null;
  area_id: number | null;
  room_id: number | null;
  qr_code: QRCodeData;
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  survey_title: string;
  site_name: string;
  building_name: string;
  wing_name: string | null;
  floor_name: string | null;
  area_name: string | null;
  room_name: string | null;
  qr_code_url: string;
}

interface QuestionOption {
  id: number;
  question_id: number;
  qname: string;
  option_type: string;
  active: number;
  created_at: string;
  updated_at: string;
}

interface SurveyQuestion {
  id: number;
  checklist_id: number;
  descr: string;
  qtype: string;
  qnumber: number;
  active: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  options: QuestionOption[];
}

interface SurveyMappingDetail {
  id: number;
  name: string;
  check_type: string;
  active: number;
  no_of_associations: number;
  questions_count: number;
  mappings: SurveyMapping[];
  questions: SurveyQuestion[];
  created_by: string;
}

interface LocationTableItem {
  mapping_id: number;
  site: string;
  building: string;
  wing: string | null;
  floor: string | null;
  area: string | null;
  room: string | null;
  qr_code: string;
  created_by: string;
  created_at: string;
  active: boolean;
  survey_id: number;
}

export const SurveyMappingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [mapping, setMapping] = useState<SurveyMappingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("survey-information");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchSurveyMappingDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/survey_mappings/mappings_list.json?q[id_eq]=${id}`);
      console.log('Survey mapping details response:', response.data);
      
      // The API returns an object with survey_mappings array
      const surveyMappings = response.data.survey_mappings || [];
      if (surveyMappings.length > 0) {
        setMapping(surveyMappings[0]);
      } else {
        setMapping(null);
      }
    } catch (error: unknown) {
      console.error('Error fetching survey mapping details:', error);
      toast.error("Failed to fetch survey mapping details");
      setMapping(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchSurveyMappingDetails();
    }
  }, [id, fetchSurveyMappingDetails]);

  const handleBack = () => {
    navigate('/maintenance/survey/mapping');
  };

  const handleEdit = () => {
    navigate(`/maintenance/survey/mapping/edit/${id}`);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDownloadQRCode = async (qrCodeUrl: string, mappingId: number) => {
    try {
      const response = await apiClient.post(`/survey_mappings/download_qr_codes?survey_mapping_ids=${mappingId}`, {}, {
        responseType: 'blob'
      });
      
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-mapping-${mappingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("QR Code PDF downloaded successfully");
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error("Failed to download QR code PDF");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  // Location details table configuration
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const [selectedLocationObjects, setSelectedLocationObjects] = useState<SurveyMapping[]>([]);

  // Selection handlers
  const handleLocationSelect = (locationId: string, isSelected: boolean) => {
    const id = parseInt(locationId);
    setSelectedLocations(prev =>
      isSelected
        ? [...prev, id]
        : prev.filter(locId => locId !== id)
    );
    
    const location = mapping?.mappings.find(m => m.id === id);
    if (location) {
      setSelectedLocationObjects(prev =>
        isSelected
          ? [...prev, location]
          : prev.filter(loc => loc.id !== id)
      );
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedLocations(mapping?.mappings.map(m => m.id) || []);
      setSelectedLocationObjects(mapping?.mappings || []);
    } else {
      setSelectedLocations([]);
      setSelectedLocationObjects([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedLocations([]);
    setSelectedLocationObjects([]);
  };

  const handleMoveAssets = () => {
    // Implement move assets logic
    console.log('Moving assets for:', selectedLocations);
  };

  const handlePrintQR = () => {
    // Implement print QR logic
    console.log('Printing QR codes for:', selectedLocations);
  };

  const handleDownload = () => {
    // Implement download logic
    console.log('Downloading for:', selectedLocations);
  };

  const handleDispose = () => {
    // Implement dispose logic
    console.log('Disposing:', selectedLocations);
  };

  const locationTableColumns: ColumnConfig[] = [
    {
      key: "mapping_id",
      label: "Mapping ID",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    // {
    //   key: "site",
    //   label: "Site",
    //   sortable: false,
    //   draggable: false,
    //   defaultVisible: true,
    // },
    {
      key: "building",
      label: "Building",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    {
      key: "wing",
      label: "Wing",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    {
      key: "floor",
      label: "Floor",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    {
      key: "area",
      label: "Area",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    {
      key: "room",
      label: "Room",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    {
      key: "created_by",
      label: "Created By",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    {
      key: "created_at",
      label: "Created Date",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
     {
      key: "qr_code",
      label: "QR Code",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
  ];

  // Prepare location data for table
  const locationTableData = React.useMemo((): LocationTableItem[] => {
    if (!mapping || !mapping.mappings) return [];
    
    return mapping.mappings.map(mappingItem => ({
      mapping_id: mappingItem.id,
      site: mappingItem.site_name,
      building: mappingItem.building_name,
      wing: mappingItem.wing_name,
      floor: mappingItem.floor_name,
      area: mappingItem.area_name,
      room: mappingItem.room_name,
      qr_code: mappingItem.qr_code_url,
      created_by: mappingItem.created_by,
      created_at: mappingItem.created_at,
      active: mappingItem.active,
      survey_id: mappingItem.survey_id,
    }));
  }, [mapping]);

  // Questions table configuration
  const questionsTableColumns: ColumnConfig[] = [
    {
      key: "qnumber",
      label: "Q",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    {
      key: "id",
      label: "ID",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    {
      key: "descr",
      label: "Question",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    // {
    //   key: "qtype",
    //   label: "Type",
    //   sortable: false,
    //   draggable: false,
    //   defaultVisible: true,
    // },
    {
      key: "options",
      label: "Input Type",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
   
    {
      key: "created_by",
      label: "Created By",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    {
      key: "created_at",
      label: "Created Date",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
  ];

  // Prepare questions data for table
  const questionsTableData = React.useMemo(() => {
    if (!mapping || !mapping.questions) return [];
    return mapping.questions.map((question, index) => ({
      qnumber: `Q${index + 1}`,
      id: question.id,
      descr: question.descr,
      qtype: question.qtype.replace(/_/g, ' '),
      options: question,
      active: question.active,
      created_by: question.created_by || "—",
      created_at: formatDate(question.created_at),
    }));
  }, [mapping]);

  // Custom cell renderer for questions table
  const renderQuestionCell = (item: QuestionsTableItem, columnKey: string): React.ReactNode => {
    switch (columnKey) {
      case "options": {
        const question = item.options as SurveyQuestion;
        return renderQuestionOptions(question);
      }
      case 'status': {
        return (
          <div className="flex items-center justify-center">
            <button
              onClick={() => handleQuestionStatusToggle(item)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                item.active ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                item.active ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        );
      }
      default:
        return item[columnKey as keyof QuestionsTableItem] as React.ReactNode;
    }
  };

  // Handle status toggle for individual questions
  const handleQuestionStatusToggle = async (item: QuestionsTableItem) => {
    // Convert active from number (0/1) to boolean for toggle logic
    const currentStatus = Boolean(item.active);
    const newStatus = !currentStatus; // Toggle between true/false

    try {
      // Use apiClient instead of fetch to avoid CORS issues
      await apiClient.put(`/snag_questions/${item.id}.json`, {
        question_id: item.id,
        active: newStatus // Send as boolean (true/false) as requested
      });

      // Update local state on success - update the question in the questions array
      setMapping(prev => {
        if (!prev) return prev;

        const updatedQuestions = prev.questions.map(question =>
          question.id === item.id
            ? { ...question, active: newStatus ? 1 : 0 }
            : question
        );

        return {
          ...prev,
          questions: updatedQuestions
        };
      });

      toast.success(`Question status ${newStatus ? 'activated' : 'deactivated'}`);

    } catch (error: unknown) {
      console.error('Error toggling question status:', error);
      toast.error("Failed to toggle question status");
    }
  };

  // Handle status toggle for individual mappings
  const handleStatusToggle = async (item: LocationTableItem) => {
    const newStatus = !item.active;
    
    try {
      // Call the API to toggle status for individual mapping
      await apiClient.put(`/survey_mappings/${item.survey_id}/toggle_status.json`, {
        mapping_id: item.mapping_id,
        active: newStatus
      });
      
      // Update local state on success - update the mapping in the mappings array
      setMapping(prev => {
        if (!prev) return prev;
        
        const updatedMappings = prev.mappings.map(mappingItem => 
          mappingItem.id === item.mapping_id 
            ? { ...mappingItem, active: newStatus }
            : mappingItem
        );
        
        return {
          ...prev,
          mappings: updatedMappings
        };
      });
      
      toast.success(`Location mapping status ${item.active ? 'deactivated' : 'activated'}`);
      
    } catch (error: unknown) {
      console.error('Error toggling location mapping status:', error);
      toast.error("Cannot activate mapping because survey is inactive");
    }
  };

  // Custom cell renderer for the table
  const renderLocationCell = (item: LocationTableItem, columnKey: string): React.ReactNode => {
    switch (columnKey) {
      case 'mapping_id':
        return <span >{item.mapping_id}</span>;
        // <Badge variant="outline" className="text-xs">
         
          // </Badge>;
      case 'site':
        return <span >{item.site}</span>;
      case 'building':
        return <span >{item.building}</span>;
      case 'wing':
        return item.wing ? <span >{item.wing}</span> : <span className="text-gray-400">—</span>;
      case 'floor':
        return item.floor ? <span >{item.floor}</span> : <span className="text-gray-400">—</span>;
      case 'area':
        return item.area ? <span >{item.area}</span> : <span className="text-gray-400">—</span>;
      case 'room':
        return item.room ? <span >{item.room}</span> : <span className="text-gray-400">—</span>;
      case 'qr_code':
        return item.qr_code ? (
          <div className="flex items-center gap-2">
            <img
              src={item.qr_code}
              alt="QR Code"
              className="w-5 h-5 object-contain border border-gray-200 rounded cursor-pointer hover:scale-110 transition-transform"
              onClick={() => window.open(item.qr_code, '_blank')}
              title="Click to view full size"
            />
            <span
              onClick={() => handleDownloadQRCode(item.qr_code!, item.mapping_id)}
              className="text-xs px-2 py-1 text-black cursor-pointer hover:underline"
              title="Download QR Code"
            >
              Download
            </span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">No QR Code</span>
        );
      case 'created_by':
        return <span className="text-sm">{item.created_by}</span>;
      case 'created_at':
        return <span className="text-sm">{formatDate(item.created_at)}</span>;
      case 'status':
        return (
          <div className="flex items-center justify-center">
            <button
              onClick={() => handleStatusToggle(item)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                item.active ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                item.active ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        );
      default:
        return item[columnKey as keyof LocationTableItem];
    }
  };

  // Helper function to render options based on question type
  const renderQuestionOptions = (question: SurveyQuestion) => {
    // Check if question type is rating or emoji first (based on qtype field)
    const questionType = question.qtype.toLowerCase();
    const isRating = questionType.includes('rating') || 
                    questionType.includes('star') || 
                    questionType.includes('scale');
    
    const isEmoji = questionType.includes('emoji') || 
                   questionType.includes('smiley') || 
                   questionType.includes('emotion');

    // Handle specific question types as per user request
    if (question.qtype === 'rating') {
      return <span className="text-yellow-400 text-sm">⭐</span>;
    }

    if (question.qtype === 'emoji') {
      return <span className="text-1xl">😊</span>;
    }

    if (question.qtype === 'multiple') {
      return (
        <div>
          <span className="text-sm">Radio Button</span>
          <div className="flex flex-wrap gap-2">
            {/* {question.options && question.options.length > 0 ? (
              question.options.map((option, optIndex) => (
                <span key={optIndex} className="text-sm">{option.qname}</span>
              ))
            ) : (
              <span className="text-gray-400">No options</span>
            )} */}
          </div>
        </div>
      );
    }

    // Existing logic for other types
    // Check if it might be a numeric rating based on option names
    const isNumericRating = question.options.every(opt => /^\d+$/.test(opt.qname.trim()));
    
    if (isNumericRating) {
      const ratings = question.options
        .map(opt => parseInt(opt.qname) || 0)
        .filter(rating => rating > 0);
      
      if (ratings.length > 0) {
        const maxRating = Math.max(...ratings);
        const minRating = Math.min(...ratings);
        
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: maxRating }, (_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < minRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {minRating !== maxRating ? `${minRating}-${maxRating}` : `${maxRating}`} 
                {' '}
                {maxRating === 1 ? 'star' : 'stars'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {question.options.map((option, optIndex) => (
                <span
                  key={optIndex}
                  className={`text-xs px-2 py-1 rounded border ${
                    option.option_type === 'p' 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : option.option_type === 'n'
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : 'bg-yellow-50 border-yellow-200 text-gray-700'
                  }`}
                >
                  ⭐ {option.qname}
                </span>
              ))}
            </div>
          </div>
        );
      }
    }

    // Handle emoji questions
    if (isEmoji) {
      // Default emoji set for satisfaction scale
      const defaultEmojis = [
        // { emoji: '😢', label: 'Very Dissatisfied' },
        // { emoji: '😞', label: 'Dissatisfied' },
        // { emoji: '😐', label: 'Neutral' },
        // { emoji: '😊', label: 'Satisfied' },
        // { emoji: '😀', label: 'Very Satisfied' }
      ];

      return (
        <div className="flex flex-col ">
          {/* Large emoji display */}
          <div className="flex items-center">
            {defaultEmojis.map((item, index) => (
              <span key={index} className="text-1xl" title={item.label}>
                {item.emoji}
              </span>
            ))}
            {/* <span className="text-xs text-gray-600">Emoji Scale</span> */}
          </div>
          {/* Show configured options if available */}
          {question.options && question.options.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {question.options.map((option, optIndex) => {
                // Enhanced emoji mapping
                const emojiMap: { [key: string]: string } = {
                  'very_satisfied': '😀', 'satisfied': '😊', 'neutral': '😐',
                  'dissatisfied': '😞', 'very_dissatisfied': '😢',
                  'very_happy': '😀', 'happy': '😊', 'okay': '😐',
                  'sad': '😞', 'very_sad': '😢',
                  'excellent': '😀', 'good': '😊', 'average': '😐',
                  'poor': '😞', 'terrible': '😢',
                  'amazing': '😀', 'awesome': '😀', 'fantastic': '😀'
                };
                
                const optionKey = option.qname.toLowerCase().replace(/\s+/g, '_');
                let emoji = emojiMap[optionKey];
                
                if (!emoji) {
                  for (const [key, value] of Object.entries(emojiMap)) {
                    if (optionKey.includes(key) || key.includes(optionKey)) {
                      emoji = value;
                      break;
                    }
                  }
                }
                
                if (!emoji) {
                  emoji = defaultEmojis[optIndex % 5]?.emoji || '😐';
                }
                
                return (
                  <div
                    key={optIndex}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${
                      option.option_type === 'p' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : option.option_type === 'n'
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-yellow-50 border-yellow-200 text-gray-700'
                    }`}
                  >
                    <span className="text-sm">{emoji}</span>
                    <span>{option.qname}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="text-xs text-gray-500"></span>
          )}
        </div>
      );
    }

    // Handle regular questions with options
    if (question.options && question.options.length > 0) {
      // Check if it might be a numeric rating based on option names
      const isNumericRating = question.options.every(opt => /^\d+$/.test(opt.qname.trim()));
      
      if (isNumericRating) {
        const ratings = question.options
          .map(opt => parseInt(opt.qname) || 0)
          .filter(rating => rating > 0);
        
        if (ratings.length > 0) {
          const maxRating = Math.max(...ratings);
          const minRating = Math.min(...ratings);
          
          return (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: maxRating }, (_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < minRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {minRating !== maxRating ? `${minRating}-${maxRating}` : `${maxRating}`} 
                  {' '}
                  {maxRating === 1 ? 'star' : 'stars'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {question.options.map((option, optIndex) => (
                  <span
                    key={optIndex}
                    className={`text-xs px-2 py-1 rounded border ${
                      option.option_type === 'p' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : option.option_type === 'n'
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-yellow-50 border-yellow-200 text-gray-700'
                    }`}
                  >
                    ⭐ {option.qname}
                  </span>
                ))}
              </div>
            </div>
          );
        }
      }

      // Default rendering for other question types with options
      return (
        <div className="flex flex-wrap gap-1">
          {question.options.map((option, optIndex) => (
            <span
              key={optIndex}
              className={`text-xs px-2 py-1 rounded ${
                option.option_type === 'p' 
                  ? 'bg-green-100 text-green-800' 
                  : option.option_type === 'n'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {option.qname} 
            </span>
          ))}
        </div>
      );
    }

    // No options available
    return <span className="text-gray-400">—</span>;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
          <span className="ml-2 text-gray-600">
            Loading survey mapping details...
          </span>
        </div>
      </div>
    );
  }

  if (!mapping) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">
            Survey Mapping not found
          </h2>
          <p className="text-gray-600 mt-2">
            The requested survey mapping could not be found.
          </p>
          <Button
            onClick={() => navigate("/maintenance/survey/mapping")}
            className="mt-4"
          >
            Back to Survey Mapping List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Survey Mapping List
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            {/* Survey Details -  */}
            {mapping.name}
          </h1>
          <div className="flex gap-2">
           <Badge
  variant={mapping.active ? "default" : "secondary"}
  className="mr-2 rounded-none flex items-center"
>
  {mapping.active ? (
    <>
      <CheckCircle className="w-3 h-3 mr-1" />
      Active
    </>
  ) : (
    <>
      <XCircle className="w-3 h-3 mr-1" />
      Inactive
    </>
  )}
  <ChevronDown className="w-3 h-3 ml-1" />
</Badge>

            <Button
              onClick={handleEdit}
              variant="outline"
              className="border-[#C72030] text-[#C72030]"
            >
              <Edit className="w-4 h-4 " />

            </Button>
            {/* <Button
              onClick={handleDelete}
              variant="destructive"
              style={{ backgroundColor: "#C72030" }}
              className="text-white hover:bg-[#C72030]/90"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button> */}
          </div>
        </div>
      </div>

      <div className=" rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* <TabsList className="flex flex-nowrap justify-start overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg h-auto p-0 text-sm">
            {[
              { label: "Survey Information", value: "survey-information" },
              { label: "Questions", value: "questions" },
              { label: "Location Details", value: "location-details" },
              // { label: "QR Code", value: "qr-code" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList> */}
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
  {[
    {
      label: "Survey Information",
      value: "survey-information",
      // icon: (
      //   <svg
      //     xmlns="http://www.w3.org/2000/svg"
      //     width="20"
      //     height="20"
      //     viewBox="0 0 24 24"
      //     fill="none"
      //     strokeWidth={2}
      //     className="w-4 h-4 stroke-black group-data-[state=active]:stroke-[#C72030]"
      //   >
      //     <path d="M4 4h16v16H4z" />
      //     <path d="M8 8h8v8H8z" />
      //   </svg>
      // ),
    },
    {
      label: "Questions",
      value: "questions",
      // icon: (
      //   <svg
      //     xmlns="http://www.w3.org/2000/svg"
      //     width="20"
      //     height="20"
      //     viewBox="0 0 24 24"
      //     fill="none"
      //     strokeWidth={2}
      //     className="w-4 h-4 stroke-black group-data-[state=active]:stroke-[#C72030]"
      //   >
      //     <path d="M9 18h6" />
      //     <path d="M10 14a4 4 0 1 1 4-4c0 2-2 3-2 3" />
      //     <path d="M12 20h0" />
      //   </svg>
      // ),
    },
    {
      label: "Location Details",
      value: "location-details",
      // icon: (
      //   <svg
      //     xmlns="http://www.w3.org/2000/svg"
      //     width="20"
      //     height="20"
      //     viewBox="0 0 24 24"
      //     fill="none"
      //     strokeWidth={2}
      //     className="w-4 h-4 stroke-black group-data-[state=active]:stroke-[#C72030]"
      //   >
      //     <path d="M12 21C12 21 5 13.6 5 9a7 7 0 0 1 14 0c0 4.6-7 12-7 12z" />
      //     <circle cx="12" cy="9" r="2.5" />
      //   </svg>
      // ),
    },
    // {
    //   label: "Logs",
    //   value: "logs",
    // },
  ].map((tab) => (
    <TabsTrigger
      key={tab.value}
      value={tab.value}
      className="group flex items-center gap-2 border-none font-semibold data-[state=active]:bg-[#EDEAE3] data-[state=inactive]:bg-white data-[state=inactive]:text-black"
    >
      {tab.icon}
      {tab.label}
    </TabsTrigger>
  ))}
</TabsList>


          {/* Survey Information */}
          <TabsContent value="survey-information" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
             <Card className="bg-[#F6F4EE]">
  <CardContent className="p-6">
    <div className="flex items-center gap-3">
      <div className="w-14 h-14 bg-[#C7203014] flex items-center justify-center rounded-full">
        <QuestionMark className="w-5 h-5 text-[#C72030]" />
      </div>
      <div>
        <p className="text-xl font-semibold text-[#C72030]">
          {mapping.questions_count || 0}
        </p>
        <p className="text-sm text-gray-600">Questions</p>
      </div>
    </div>
  </CardContent>
</Card>


             <Card className="bg-[#F6F4EE]">
  <CardContent className="p-6">
    <div className="flex items-center gap-3">
      <div className="w-14 h-14 bg-[#C7203014] flex items-center justify-center rounded-full">
        <MapPin className="w-5 h-5 text-[#C72030]" />
      </div>
      <div>
         <p className="text-xl font-semibold text-[#C72030]">
          {mapping.mappings?.length || 0}
        </p>
        <p className="text-sm text-gray-600">Location Association</p>
      </div>
    </div>
  </CardContent>
</Card>


             {/* <Card className="bg-[#F6F4EE]">
  <CardContent className="p-6">
    <div className="flex items-center gap-3">
      <List className="w-8 h-8 text-[#C72030]" />
      <div>
         <p className="text-xl font-semibold capitalize text-[#C72030]">
          {mapping.check_type || 'N/A'}
        </p>
        <p className="text-sm text-gray-600">Check Type</p>
       
      </div>
    </div>
  </CardContent>
</Card> */}
<Card className="bg-[#F6F4EE]">
  <CardContent className="p-6">
    <div className="flex items-center gap-3">
      <div className="w-14 h-14 bg-[#C7203014] flex items-center justify-center rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-[#C72030]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </div>

      <div>
        <p className="text-xl font-semibold capitalize text-[#C72030]">
          {mapping.check_type || "N/A"}
        </p>
        <p className="text-sm text-gray-600">Question Type</p>
      </div>
    </div>
  </CardContent>
</Card>


            </div>

            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
             <CardHeader className="bg-[#F6F4EE] mb-6">
  <CardTitle className="text-lg flex items-center">
    <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded-full mr-3">
      <FileText className="h-5 w-5 text-[#C72030]" />
    </div>
    Survey Information
  </CardTitle>
</CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-sm text-gray-800">
                    <span className="text-gray-500">Survey Name:</span>{" "}
                    <span className="font-medium text-gray-800">
                      {mapping.name}
                    </span>
                  </div>
                   <div className="text-sm text-gray-800">
                    <span className="text-gray-500">Question Type:</span>{" "}
                    <span className="font-medium text-gray-800">
                      {/* <Badge variant="outline" className="capitalize"> */}
                        {mapping.check_type}
                      {/* </Badge> */}
                    </span>
                  </div>
                  <div className="text-sm text-gray-800">
                    <span className="text-gray-500">Survey ID:</span>{" "}
                    <span className="font-medium text-gray-800">

                      #{mapping.id}
                    </span>
                  </div>
                  {/* <div className="text-sm text-gray-800">
                    <span className="text-gray-500">Total Locations:</span>{" "}
                    <span className="font-medium text-gray-800">
                      {mapping.mappings?.length || 0}
                    </span>
                  </div> */}
                   <div className="text-sm text-gray-800">
                    <span className="text-gray-500">Total Associations:</span>{" "}
                    <span className="font-medium text-gray-800">
                      {mapping.no_of_associations || 0}
                    </span>
                  </div>
                  <div className="text-sm text-gray-800">
                    <span className="text-gray-500">Total Questions:</span>{" "}
                    <span className="font-medium text-gray-800">
                      {mapping.questions_count || 0}
                    </span>
                  </div>
                 
                  <div className="text-sm text-gray-800">
                    <span className="text-gray-500">Status:</span>{" "}
                    <span className="font-medium text-red-800">
                      {mapping.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-800">
                    <span className="text-gray-500">Created By:</span>{" "}
                    <span className="font-medium text-gray-800">
                      {mapping.created_by || mapping.mappings?.[0]?.created_by || "N/A"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-800">
                    <span className="text-gray-500">Created On:</span>{" "}
                    <span className="font-medium text-gray-800">
                      {mapping.created_at ? formatDate(mapping.created_at) : mapping.mappings?.[0]?.created_at ? formatDate(mapping.mappings[0].created_at) : "N/A"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-800">
                    <span className="text-gray-500">Last Updated:</span>{" "}
                    <span className="font-medium text-gray-800">
                      {mapping.updated_at ? formatDate(mapping.updated_at) : mapping.mappings?.[0]?.updated_at ? formatDate(mapping.mappings[0].updated_at) : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Summary */}
            {/* {mapping.mappings && mapping.mappings.length > 0 && (
              <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
                <CardHeader className="bg-[#F6F4EE] mb-6">
                  <CardTitle className="text-lg flex items-center">
                    <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                      <MapPin className="h-4 w-4" />
                    </div>
                    LOCATION SUMMARY
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mapping.mappings.slice(0, 6).map((mappingItem, index) => (
                      <div key={mappingItem.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            #{mappingItem.id}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {mappingItem.created_by}
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div><strong>Site:</strong> {mappingItem.site_name}</div>
                          <div><strong>Building:</strong> {mappingItem.building_name}</div>
                          {mappingItem.wing_name && (
                            <div><strong>Wing:</strong> {mappingItem.wing_name}</div>
                          )}
                          {mappingItem.floor_name && (
                            <div><strong>Floor:</strong> {mappingItem.floor_name}</div>
                          )}
                          {mappingItem.area_name && (
                            <div><strong>area:</strong> {mappingItem.area_name}</div>
                            )}
                          {mappingItem.room_name && (
                            <div><strong>Room:</strong> {mappingItem.room_name}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {mapping.mappings.length > 6 && (
                    <div className="mt-4 text-center">
                      <Badge variant="secondary">
                        +{mapping.mappings.length - 6} more locations
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )} */}
          </TabsContent>

          {/* Questions */}
          <TabsContent value="questions" className="mt-4">
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
    <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded-full mr-3">
      <QuestionMark className="h-5 w-5 text-[#C72030]" />
    </div>
                  Survey Question 
                  {/* ({mapping.questions?.length || 0}) */}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedTable
                  data={questionsTableData}
                  columns={questionsTableColumns}
                  renderCell={renderQuestionCell}
                  getItemId={(item: QuestionsTableItem) => String(item.id)}
                  storageKey="survey-questions-table"
                  className="min-w-[800px] bg-[#F6F7F7]"
                  emptyMessage="No questions available"
                  enableSearch={true}
                  enableSelection={false}
                  hideTableExport={false}
                  hideTableSearch={false}
                  pagination={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Details */}
          <TabsContent value="location-details" className="mt-4">
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
    <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded-full mr-3">
      <MapPin className="h-5 w-5 text-[#C72030]" />
    </div>
                  Location Details
                  {/* ({mapping.mappings?.length || 0} Locations) */}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                {selectedLocations.length > 0 && (
                  <LocationSelectionPanel
                    selectedLocations={selectedLocations}
                    selectedLocationObjects={selectedLocationObjects}
                    onMoveAssets={handleMoveAssets}
                    onPrintQR={handlePrintQR}
                    onDownload={handleDownload}
                    onDispose={handleDispose}
                    onClearSelection={handleClearSelection}
                  />
                )}
                <EnhancedTable
                  data={locationTableData}
                  columns={locationTableColumns}
                  selectable={true}
                  renderCell={renderLocationCell}
                  selectedItems={selectedLocations.map(String)}
                  onSelectItem={handleLocationSelect}
                  onSelectAll={handleSelectAll}
                  getItemId={(item: LocationTableItem) => String(item.mapping_id)}
                  storageKey="location-details-table"
                  className="min-w-[1200px] bg-[#F6F7F7]"
                  emptyMessage="No location details found"
                  enableSearch={true}
                  enableSelection={false}
                  hideTableExport={false}
                  hideTableSearch={false}
                  pagination={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

      <TabsContent value="logs" className="mt-4">
  <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
    <CardHeader className="bg-[#F6F4EE] mb-6">
  <CardTitle className="text-lg flex items-center">
    <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded-full mr-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="26"
        viewBox="0 0 18 26"
        fill="none"
      >
        <path
          d="M9 25H2C1.73478 25 1.48043 24.8736 1.29289 24.6485C1.10536 24.4235 1 24.1183 1 23.8V2.2C1 1.88174 1.10536 1.57652 1.29289 1.35147C1.48043 1.12643 1.73478 1 2 1H16C16.2652 1 16.5196 1.12643 16.7071 1.35147C16.8946 1.57652 17 1.88174 17 2.2V13M14.75 25V17.2"
          stroke="#C72030"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 19L12.8333 18.3333L14.5 17L16.1667 18.3333L17 19"
          stroke="#C72030"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 8H13M5 13H9"
          stroke="#C72030"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
    LOGS
  </CardTitle>
</CardHeader>


    <CardContent>
  <div className="relative">
    {/* Icon at the top of the line */}
<div className="flex items-center mb-2">
  <div className="w-8 h-8 ml-2 flex items-center justify-center rounded-full mr-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="22"
      viewBox="0 0 18 26"
      fill="none"
    >
      <path
        d="M9 25H2C1.73478 25 1.48043 24.8736 1.29289 24.6485C1.10536 24.4235 1 24.1183 1 23.8V2.2C1 1.88174 1.10536 1.57652 1.29289 1.35147C1.48043 1.12643 1.73478 1 2 1H16C16.2652 1 16.5196 1.12643 16.7071 1.35147C16.8946 1.57652 17 1.88174 17 2.2V13M14.75 25V17.2"
        stroke="#C72030"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 19L12.8333 18.3333L14.5 17L16.1667 18.3333L17 19"
        stroke="#C72030"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 8H13M5 13H9"
        stroke="#C72030"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  </div>
  <h3 className="text-lg text-[#C72030] font-semibold">Logs</h3>
</div>


    {/* Vertical timeline line */}
    <div className="absolute left-5 top-8 bottom-9 w-0.5 bg-[#C72030] z-0"></div>

    <div className="space-y-6 relative z-10">
      {/* Log Entry - 23 Feb 2025 */}
      <div className="flex items-start">
  <div className="flex-shrink-0 w-3 h-3 bg-[#C72030] rounded-full mt-4 ml-4"></div>
  <div className="ml-8">
    <p className="text-md font-semibold text-gray-900">23 Feb 2025</p>
    <p className="text-gray-700">
      <span className="text-gray-500">6:30PM </span>
      <span className="text-black font-semibold">Survey Created By Abdul</span>
    </p>
    <p className="text-gray-700">
      <span className="text-gray-500">7:30PM </span>
      <span className="text-black font-semibold">Location Edited By Abdul</span>
    </p>
  </div>
</div>


      {/* Log Entry - 21 Feb 2025 */}
      <div className="flex items-start">
        <div className="flex-shrink-0 w-3 h-3 bg-[#C72030] rounded-full mt-1.5 ml-4"></div>
        <div className="ml-8">
          <p className="text-md font-semibold text-gray-900">21 Feb 2025</p>
          <p className="text-gray-700">
            <span className='text-gray-500'>6:30PM</span> 
            <span className='text-black font-semibold'>Question Marked Inactive By Abdul</span>
            </p>
        </div>
      </div>
    </div>
  </div>
</CardContent>
  </Card>
</TabsContent>


          {/* QR Code */}
          <TabsContent value="qr-code" className="p-3 sm:p-6">
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <QrCode className="h-4 w-4" />
                  </div>
                  QR CODES ({mapping.mappings?.length || 0} Locations)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mapping.mappings && mapping.mappings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mapping.mappings.map((mappingItem) => (
                      <div key={mappingItem.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="text-xs">
                            Mapping #{mappingItem.id}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {mappingItem.created_by}
                          </span>
                        </div>
                        
                        {/* Location Info */}
                        <div className="mb-4 text-sm space-y-1">
                          <div><strong>Site:</strong> {mappingItem.site_name}</div>
                          <div><strong>Building:</strong> {mappingItem.building_name}</div>
                          {mappingItem.wing_name && (
                            <div><strong>Wing:</strong> {mappingItem.wing_name}</div>
                          )}
                          {mappingItem.floor_name && (
                            <div><strong>Floor:</strong> {mappingItem.floor_name}</div>
                          )}
                          {mappingItem.room_name && (
                            <div><strong>Room:</strong> {mappingItem.room_name}</div>
                          )}
                        </div>

                        {/* QR Code Display */}
                        {mappingItem.qr_code_url ? (
                          <div className="flex flex-col items-center">
                            <div className="mb-3">
                              <img 
                                src={mappingItem.qr_code_url}
                                alt={`QR Code for Mapping ${mappingItem.id}`}
                                className="w-32 h-32 object-contain border border-gray-200 rounded-lg shadow-sm"
                              />
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(mappingItem.qr_code_url, '_blank')}
                              className="flex items-center gap-2 text-xs"
                            >
                              <Eye className="w-3 h-3" />
                              View Full Size
                            </Button>
                            
                            {/* QR Code Details */}
                            {mappingItem.qr_code && (
                              <div className="mt-3 text-xs text-gray-600 space-y-1">
                                <div><strong>File:</strong> {mappingItem.qr_code.document_file_name}</div>
                                <div><strong>Size:</strong> {mappingItem.qr_code.document_file_size} bytes</div>
                                <div><strong>Type:</strong> {mappingItem.qr_code.document_content_type}</div>
                                <div><strong>Created:</strong> {formatDate(mappingItem.qr_code.created_at)}</div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                            <QrCode className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">No QR Code</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
                    <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No QR Codes Available
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      No QR codes have been generated for this survey mapping yet.
                    </p>
                  </div>
                )}

                {mapping.mappings && mapping.mappings.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      <p className="text-sm font-medium text-blue-800">
                        QR Code Usage
                      </p>
                    </div>
                    <p className="text-xs text-blue-700">
                      Each QR code is specific to its location mapping. Place each QR code at its respective 
                      mapped location for easy access by survey respondents. Scanning a QR code will direct 
                      users to the survey for that specific location.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
