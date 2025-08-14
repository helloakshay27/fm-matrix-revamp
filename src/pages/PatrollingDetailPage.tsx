import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Trash2, Clock, MapPin, ListChecks, Users, Calendar, 
  CheckCircle, XCircle, Loader2, FileTextIcon, QrCode, Activity, 
  Shield, Eye, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';
import { DeletePatrollingModal } from '@/components/DeletePatrollingModal';

// Type definitions matching the API response
interface ChecklistData {
  id: number;
  name: string;
  check_type: string;
  snag_audit_category_id: number;
  company_id: number;
  user_id: number;
  active: number;
  created_at: string;
  updated_at: string;
}

interface QuestionData {
  id: number;
  task: string;
  type: string;
  mandatory: boolean;
  qnumber: number;
  options: string[];
  created_at: string;
  updated_at: string;
}

interface ScheduleData {
  id: number;
  name: string;
  frequency_type: string;
  start_time: string;
  start_date: string;
  end_date: string | null;
  assigned_guard_id: number;
  supervisor_id: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface CheckpointData {
  id: number;
  name: string;
  description: string;
  order_sequence: number;
  building_id: number | null;
  wing_id: number | null;
  floor_id: number | null;
  room_id: number | null;
  estimated_time_minutes: number;
  snag_checklist_id: number | null;
  schedule_ids: number[];
  created_at: string;
  updated_at: string;
  qr_code_available: boolean;
  qr_code_url?: string;
  building_name?: string;
  wing_name?: string;
  floor_name?: string;
  room_name?: string;
}

interface PatrollingDetail {
  id: number;
  name: string;
  description: string;
  estimated_duration_minutes: number;
  auto_ticket: boolean;
  validity_start_date: string;
  validity_end_date: string;
  grace_period_minutes: number;
  active: boolean;
  resource_type: string;
  resource_id: number;
  created_by_id: number;
  created_at: string;
  updated_at: string;
  checklist: ChecklistData;
  questions: QuestionData[];
  schedules: ScheduleData[];
  checkpoints: CheckpointData[];
  recent_sessions: any[];
  summary: {
    questions_count: number;
    schedules_count: number;
    checkpoints_count: number;
    recent_sessions_count: number;
    total_sessions_count: number;
  };
}

export const PatrollingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patrolling, setPatrolling] = useState<PatrollingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('patrol-information');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPatrollingDetail(parseInt(id));
    }
  }, [id]);

  const fetchPatrollingDetail = async (patrollingId: number) => {
    setLoading(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;
      
      if (!baseUrl || !token) {
        throw new Error('API configuration is missing');
      }

      const apiUrl = getFullUrl(`/patrolling/setup/${patrollingId}.json`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setPatrolling(result.data);
      } else {
        throw new Error('Failed to fetch patrolling details');
      }
    } catch (error: any) {
      console.error('Error fetching patrolling details:', error);
      toast.error(`Failed to load patrolling details: ${error.message}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '—';
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '—';
    try {
      return new Date(timeString).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '—';
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '—';
    }
  };

  const handleEdit = () => {
    navigate(`/security/patrolling/edit/${id}`);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;
      
      if (!baseUrl || !token) {
        throw new Error('API configuration is missing');
      }

      const apiUrl = getFullUrl(`/patrolling/setup/${id}.json`);
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success('Patrolling deleted successfully!', {
        duration: 3000,
      });
      
      setIsDeleteModalOpen(false);
      navigate('/security/patrolling');
    } catch (error: any) {
      console.error('Error deleting patrolling:', error);
      toast.error(`Failed to delete patrolling: ${error.message}`, {
        duration: 5000,
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
          <span className="ml-2 text-gray-600">Loading patrolling details...</span>
        </div>
      </div>
    );
  }

  if (!patrolling) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Patrolling not found</h2>
          <p className="text-gray-600 mt-2">The requested patrolling could not be found.</p>
          <Button onClick={() => navigate('/security/patrolling')} className="mt-4">
            Back to Patrolling List
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
          onClick={() => navigate('/security/patrolling')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Patrolling List
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Patrolling Details - {patrolling.name}</h1>
          <div className="flex gap-2">
            <Badge variant={patrolling.active ? "default" : "secondary"} className="mr-2">
              {patrolling.active ? (
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
            <Button
              onClick={handleDelete}
              variant="destructive"
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className="flex flex-nowrap justify-start overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg h-auto p-0 text-sm"
          >
            {[
              { label: 'Patrol Information', value: 'patrol-information' },
              { label: 'Questions', value: 'questions' },
              { label: 'Schedules', value: 'schedules' },
              { label: 'Checkpoints', value: 'checkpoints' },
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

          {/* Patrol Information */}
          <TabsContent value="patrol-information" className="p-3 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-xl font-semibold">{patrolling.estimated_duration_minutes} min</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <ListChecks className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Questions</p>
                      <p className="text-xl font-semibold">{patrolling.summary.questions_count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Schedules</p>
                      <p className="text-xl font-semibold">{patrolling.summary.schedules_count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">Checkpoints</p>
                      <p className="text-xl font-semibold">{patrolling.summary.checkpoints_count}</p>
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
                  PATROL INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><strong>Name:</strong> {patrolling.name}</div>
                  <div><strong>Description:</strong> {patrolling.description || '—'}</div>
                  <div><strong>Start Date:</strong> {formatDate(patrolling.validity_start_date)}</div>
                  <div><strong>End Date:</strong> {formatDate(patrolling.validity_end_date)}</div>
                  <div><strong>Grace Period:</strong> {patrolling.grace_period_minutes} minutes</div>
                  <div><strong>Auto Ticket:</strong> {patrolling.auto_ticket ? 'Yes' : 'No'}</div>
                
                  <div><strong>Status:</strong> 
                    <Badge variant={patrolling.active ? "default" : "secondary"} className="ml-2">
                      {patrolling.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div><strong>Created:</strong> {formatDateTime(patrolling.created_at)}</div>
                </div>
              </CardContent>
            </Card>

            {/* Checklist Information */}
            {patrolling.checklist && (
              <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
                <CardHeader className="bg-[#F6F4EE] mb-6">
                  <CardTitle className="text-lg flex items-center">
                    <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                      <ListChecks className="h-4 w-4" />
                    </div>
                    CHECKLIST INFORMATION
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong>Checklist Name:</strong> {patrolling.checklist.name}</div>
                    <div><strong>Check Type:</strong> {patrolling.checklist.check_type}</div>
                
                    <div><strong>Status:</strong> 
                      <Badge variant={patrolling.checklist.active ? "default" : "secondary"} className="ml-2">
                        {patrolling.checklist.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div><strong>Created:</strong> {formatDateTime(patrolling.checklist.created_at)}</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* QR Code Section */}
            {patrolling.checkpoints.some(cp => cp.qr_code_available) && (
              <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
                <CardHeader className="bg-[#F6F4EE] mb-6">
                  <CardTitle className="text-lg flex items-center">
                    <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                      <QrCode className="h-4 w-4" />
                    </div>
                    QR CODES ({patrolling.checkpoints.filter(cp => cp.qr_code_available).length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patrolling.checkpoints
                      .filter(cp => cp.qr_code_available)
                      .map((checkpoint) => (
                        <div key={checkpoint.id} className="p-4 border rounded-lg bg-white shadow-sm">
                          <div className="text-center">
                            <div className="mb-3">
                              <p className="font-medium text-sm">{checkpoint.name}</p>
                              <p className="text-xs text-gray-600">Order #{checkpoint.order_sequence}</p>
                              <Badge variant="default" className="text-xs mt-1">
                                <QrCode className="w-3 h-3 mr-1" />
                                QR Available
                              </Badge>
                            </div>
                            
                            {checkpoint.qr_code_url ? (
                              <div className="space-y-3">
                                <div className="flex justify-center">
                                  <img 
                                    src={checkpoint.qr_code_url} 
                                    alt={`QR Code for ${checkpoint.name}`}
                                    className="w-32 h-32 object-contain border border-gray-200 rounded"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                  <div className="hidden w-32 h-32 border border-gray-200 rounded flex items-center justify-center bg-gray-50">
                                    <div className="text-center">
                                      <QrCode className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                                      <p className="text-xs text-gray-500">QR Code Error</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 justify-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(checkpoint.qr_code_url, '_blank')}
                                    className="text-xs"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    View
                                  </Button>
                                  {/* <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        const response = await fetch(checkpoint.qr_code_url!);
                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `checkpoint_${checkpoint.id}_qr_code.png`;
                                        document.body.appendChild(a);
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                        document.body.removeChild(a);
                                        toast.success('QR Code downloaded successfully!');
                                      } catch (error) {
                                        toast.error('Failed to download QR Code');
                                      }
                                    }}
                                    className="text-xs"
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    Download
                                  </Button> */}
                                </div>
                              </div>
                            ) : (
                              <div className="w-32 h-32 border border-gray-200 rounded flex items-center justify-center bg-gray-50 mx-auto">
                                <div className="text-center">
                                  <QrCode className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                                  <p className="text-xs text-gray-500">QR Code Available</p>
                                  <p className="text-xs text-gray-400">No URL provided</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <QrCode className="w-5 h-5 text-blue-600" />
                      <p className="text-sm font-medium text-blue-800">QR Code Summary</p>
                    </div>
                    <p className="text-sm text-blue-700">
                      <strong>{patrolling.checkpoints.filter(cp => cp.qr_code_available).length}</strong> out of{' '}
                      <strong>{patrolling.checkpoints.length}</strong> checkpoints have QR codes available.
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Guards can scan these QR codes to check in at each checkpoint during patrol.
                    </p>
                  </div>
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
                    <ListChecks className="h-4 w-4" />
                  </div>
                  QUESTIONS ({patrolling.questions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Q#</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Mandatory</TableHead>
                        <TableHead>Options</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {patrolling.questions.length > 0 ? (
                        patrolling.questions.map((question) => (
                          <TableRow key={question.id}>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                Q{question.qnumber}
                              </Badge>
                            </TableCell>
                            <TableCell>{question.id}</TableCell>
                            <TableCell>{question.task}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {question.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {question.mandatory ? (
                                <Badge variant="destructive" className="text-xs">
                                  Required
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  Optional
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {question.options.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {question.options.map((option, index) => (
                                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      {option}
                                    </span>
                                  ))}
                                </div>
                              ) : '—'}
                            </TableCell>
                            <TableCell className="text-xs text-gray-600">
                              {formatDateTime(question.created_at)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-gray-600">
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

          {/* Schedules */}
          <TabsContent value="schedules" className="p-3 sm:p-6">
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4" />
                  </div>
                  SCHEDULES ({patrolling.schedules.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                      
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {patrolling.schedules.length > 0 ? (
                        patrolling.schedules.map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell className="font-medium">{schedule.name}</TableCell>
                            <TableCell className="capitalize">{schedule.frequency_type}</TableCell>
                            <TableCell>{formatTime(schedule.start_time)}</TableCell>
                            <TableCell>{formatDate(schedule.start_date)}</TableCell>
                            <TableCell>{schedule.end_date ? formatDate(schedule.end_date) : formatDate(schedule.end_date)}</TableCell>
                            
                            <TableCell>
                              <Badge variant={schedule.active ? "default" : "secondary"}>
                                {schedule.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-gray-600">
                              {formatDateTime(schedule.created_at)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-gray-600">
                            No schedules available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Checkpoints */}
          <TabsContent value="checkpoints" className="p-3 sm:p-6">
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4" />
                  </div>
                  CHECKPOINTS ({patrolling.checkpoints.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Estimated Time</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Assigned Schedules</TableHead>
                        <TableHead>QR Code</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {patrolling.checkpoints.length > 0 ? (
                        patrolling.checkpoints
                          .sort((a, b) => a.order_sequence - b.order_sequence)
                          .map((checkpoint) => (
                          <TableRow key={checkpoint.id}>
                            <TableCell>
                              <Badge variant="outline">#{checkpoint.order_sequence}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{checkpoint.name}</TableCell>
                            <TableCell>{checkpoint.description || '—'}</TableCell>
                            <TableCell>{checkpoint.estimated_time_minutes} min</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>Building: {checkpoint.building_name || 'N/A'}</div>
                                <div>Wing: {checkpoint.wing_name || 'N/A'}</div>
                                <div>Floor: {checkpoint.floor_name || 'N/A'}</div>
                                <div>Room: {checkpoint.room_name || 'N/A'}</div>
                              </div>
                            </TableCell>
                            <TableCell>{checkpoint.schedule_ids.length}</TableCell>
                            <TableCell>
                              {checkpoint.qr_code_available ? (
                                <div className="flex items-center gap-2">
                                  <Badge variant="default" className="text-xs">
                                    <QrCode className="w-3 h-3 mr-1" />
                                    Available
                                  </Badge>
                                  {checkpoint.qr_code_url && (
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => window.open(checkpoint.qr_code_url, '_blank')}
                                        className="p-1 h-6 w-6"
                                        title="View QR Code"
                                      >
                                        <Eye className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={async () => {
                                          try {
                                            const response = await fetch(checkpoint.qr_code_url!);
                                            const blob = await response.blob();
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `checkpoint_${checkpoint.id}_qr_code.png`;
                                            document.body.appendChild(a);
                                            a.click();
                                            window.URL.revokeObjectURL(url);
                                            document.body.removeChild(a);
                                            toast.success('QR Code downloaded successfully!');
                                          } catch (error) {
                                            toast.error('Failed to download QR Code');
                                          }
                                        }}
                                        className="p-1 h-6 w-6"
                                        title="Download QR Code"
                                      >
                                        <Download className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  Not Available
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-gray-600">
                              {formatDateTime(checkpoint.created_at)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-gray-600">
                            No checkpoints available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Sessions */}
          <TabsContent value="recent-sessions" className="p-3 sm:p-6">
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <Activity className="h-4 w-4" />
                  </div>
                  RECENT SESSIONS ({patrolling.recent_sessions?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Session Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Guard</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {patrolling.recent_sessions && patrolling.recent_sessions.length > 0 ? (
                        patrolling.recent_sessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>{formatDateTime(session.session_date)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  session.status === 'completed' ? 'default' : 
                                  session.status === 'in_progress' ? 'secondary' : 
                                  'destructive'
                                }
                              >
                                {session.status.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>{session.guard_name || '—'}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {session.checkpoints_completed}/{session.total_checkpoints} checkpoints
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div 
                                    className="bg-[#C72030] h-2 rounded-full" 
                                    style={{
                                      width: `${(session.checkpoints_completed / session.total_checkpoints) * 100}%`
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-600 py-8">
                            <div className="flex flex-col items-center">
                              <Activity className="w-12 h-12 text-gray-300 mb-2" />
                              <p>No recent sessions found.</p>
                              <p className="text-sm text-gray-500">Sessions will appear here once patrolling starts.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      {/* Delete Confirmation Modal */}
      {id && (
        <DeletePatrollingModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          patrollingId={parseInt(id)}
        />
      )}
    </div>
  );
};
