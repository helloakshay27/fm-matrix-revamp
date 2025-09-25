import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, CheckCircle, XCircle, Edit, Trash2, List, MapPin, QrCode, Shield, Clock, Users, Calendar, Eye, Info, Download } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { apiClient } from '@/utils/apiClient';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

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
}

interface LocationTableItem {
  mapping_id: number;
  site: string;
  building: string;
  wing: string | null;
  floor: string | null;
  area: string | null;
  room: string | null;
  qr_code: string | null;
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
  const locationTableColumns: ColumnConfig[] = [
    {
      key: "mapping_id",
      label: "Mapping ID",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
    {
      key: "site",
      label: "Site",
      sortable: false,
      draggable: false,
      defaultVisible: true,
    },
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
    
    // Return all mappings as separate rows
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
        return <Badge variant="outline" className="text-xs">#{item.mapping_id}</Badge>;
      case 'site':
        return <span className="font-medium">{item.site}</span>;
      case 'building':
        return <span className="font-medium">{item.building}</span>;
      case 'wing':
        return item.wing ? <span className="font-medium">{item.wing}</span> : <span className="text-gray-400">—</span>;
      case 'floor':
        return item.floor ? <span className="font-medium">{item.floor}</span> : <span className="text-gray-400">—</span>;
      case 'area':
        return item.area ? <span className="font-medium">{item.area}</span> : <span className="text-gray-400">—</span>;
      case 'room':
        return item.room ? <span className="font-medium">{item.room}</span> : <span className="text-gray-400">—</span>;
      case 'qr_code':
        return item.qr_code ? (
          <div className="flex flex-col items-center gap-2">
            <img 
              src={item.qr_code}
              alt="QR Code"
              className="w-16 h-16 object-contain border border-gray-200 rounded cursor-pointer hover:scale-110 transition-transform"
              onClick={() => window.open(item.qr_code, '_blank')}
              title="Click to view full size"
            />
            <div className="flex gap-1">
              {/* <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(item.qr_code, '_blank')}
                className="text-xs px-2 py-1"
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button> */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDownloadQRCode(item.qr_code!, item.mapping_id)}
                className="text-xs px-2 py-1"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </div>
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
            Survey Details - {mapping.name}
          </h1>
          <div className="flex gap-2">
            <Badge
              variant={mapping.active ? "default" : "secondary"}
              className="mr-2"
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
            </Badge>
            <Button
              onClick={handleEdit}
              variant="outline"
              className="border-[#C72030] text-[#C72030]"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
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

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-nowrap justify-start overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg h-auto p-0 text-sm">
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
          </TabsList>

          {/* Survey Information */}
          <TabsContent value="survey-information" className="p-3 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Questions</p>
                      <p className="text-xl font-semibold">
                        {mapping.questions_count || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-8 h-8 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Locations</p>
                      <p className="text-xl font-semibold">
                        {mapping.mappings?.length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <List className="w-8 h-8 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Check Type</p>
                      <p className="text-xl font-semibold capitalize">
                        {mapping.check_type || 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <Shield className="h-4 w-4" />
                  </div>
                  SURVEY INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Survey Name:</strong> {mapping.name}
                  </div>
                  <div>
                    <strong>Survey ID:</strong> #{mapping.id}
                  </div>
                  <div>
                    <strong>Check Type:</strong>
                    <Badge variant="outline" className="ml-2 capitalize">
                      {mapping.check_type}
                    </Badge>
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <Badge
                      variant={mapping.active ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {mapping.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <strong>Total Locations:</strong>{" "}
                    {mapping.mappings?.length || 0}
                  </div>
                  <div>
                    <strong>Total Questions:</strong>{" "}
                    {mapping.questions_count || 0}
                  </div>
                  <div>
                    <strong>Associations:</strong>{" "}
                    {mapping.no_of_associations || 0}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Summary */}
            {mapping.mappings && mapping.mappings.length > 0 && (
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
            )}
          </TabsContent>

          {/* Questions */}
          <TabsContent value="questions" className="p-3 sm:p-6">
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <List className="h-4 w-4" />
                  </div>
                  SURVEY QUESTIONS ({mapping.questions?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Q#</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Question Number</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Options</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Created Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {mapping.questions && mapping.questions.length > 0 ? (
                        mapping.questions.map((question, index) => (
                          <TableRow key={question.id}>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                Q{index + 1}
                              </Badge>
                            </TableCell>
                            <TableCell>{question.id}</TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate" title={question.descr}>
                                {question.descr}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs capitalize">
                                {question.qtype}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">
                                {question.qnumber}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {question.active ? (
                                <Badge variant="default" className="text-xs">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {question.options && question.options.length > 0 ? (
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
                                      {option.qname} ({option.option_type})
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </TableCell>
                            <TableCell>{question.created_by || "—"}</TableCell>
                            <TableCell>{formatDate(question.created_at)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center text-gray-600"
                          >
                            No questions available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Details */}
          <TabsContent value="location-details" className="p-3 sm:p-6">
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4" />
                  </div>
                  LOCATION DETAILS ({mapping.mappings?.length || 0} Locations)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedTable
                  data={locationTableData}
                  columns={locationTableColumns}
                  renderCell={renderLocationCell}
                  storageKey="location-details-table"
                  className="min-w-[1200px]"
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
