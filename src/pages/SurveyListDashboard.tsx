import React, { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Edit, Copy, Eye, Share2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { useToast } from "@/hooks/use-toast";
import { apiClient } from '@/utils/apiClient';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface SurveyItem {
  id: number;
  name: string;
  snag_audit_category: string;
  snag_audit_sub_category: string | null;
  questions_count: number;
  active: number;
}

export const SurveyListDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      // Get the site_id from localStorage or use a default value
      const siteId = localStorage.getItem('site_id') || '2189';
      const response = await apiClient.get(`/pms/admin/snag_checklists.json?site_id=${siteId}`);
      console.log('Survey data response:', response.data);
      setSurveys(response.data || []);
    } catch (error) {
      console.error('Error fetching survey data:', error);
      setSurveys([]); // Set empty array on error
      toast({
        title: "Error",
        description: "Failed to fetch survey data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSurvey = () => {
    navigate('/maintenance/survey/add');
  };

  const handleStatusChange = (item: SurveyItem, newStatus: string) => {
    setSurveys(prevSurveys => 
      prevSurveys.map((survey) => 
        survey.id === item.id ? { ...survey, active: newStatus === 'Active' ? 1 : 0 } : survey
      )
    );
    toast({
      title: "Status Updated",
      description: `Survey status changed to ${newStatus}`
    });
  };

  const handleAction = (action: string, surveyId: number) => {
    console.log(`${action} action for survey ${surveyId}`);
    if (action === 'Edit') {
      navigate(`/maintenance/survey/edit/${surveyId}`);
    } else if (action === 'View') {
      navigate(`/maintenance/survey/details/${surveyId}`);
    } else {
      toast({
        title: `${action} Action`,
        description: `${action} action performed for survey ${surveyId}`
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600';
      case 'Inactive':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const statusOptions = ['Active', 'Inactive'];

  // Updated columns according to requirements
  const columns = [
    { key: 'actions', label: 'Actions', sortable: false, draggable: false },
    { key: 'name', label: 'Survey Name', sortable: true, draggable: true },
    { key: 'snag_audit_category', label: 'Ticket Category', sortable: true, draggable: true },
    // { key: 'snag_audit_sub_category', label: 'Sub Category', sortable: true, draggable: true }, // Hidden
    { key: 'questions_count', label: 'No. of Associations', sortable: true, draggable: true },
    // { key: 'status', label: 'Status', sortable: true, draggable: true } // Hidden
  ];

  const renderCell = (item: SurveyItem, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex space-x-1 ml-4">
            {/* <button 
              onClick={() => handleAction('Edit', item.id)}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              <Edit className="w-4 h-4" />
            </button> */}
            <button 
              onClick={() => handleAction('View', item.id)}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        );
      case 'status':
        const status = item.active === 1 ? 'Active' : 'Inactive';
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded">
              <span className={`font-medium ${getStatusColor(status)}`}>
                {status}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border shadow-lg z-50">
              {statusOptions.map((statusOption) => (
                <DropdownMenuItem
                  key={statusOption}
                  onClick={() => handleStatusChange(item, statusOption)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <span className={getStatusColor(statusOption)}>{statusOption}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case 'snag_audit_sub_category':
        return item.snag_audit_sub_category || '-';
      case 'questions_count':
        return <div className="text-center">{item.questions_count}</div>;
      default:
        return item[columnKey as keyof SurveyItem];
    }
  };

  // Filter surveys based on search term
  const filteredSurveys = surveys.filter(survey =>
    survey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.snag_audit_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center py-8">Loading surveys...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <p className="text-muted-foreground text-sm mb-2">
            Survey &gt; Survey List
          </p>
          <Heading level="h1" variant="default">Survey List</Heading>
        </div>
      </div>
      
      {/* Enhanced Survey List Table */}
      <div>
        <EnhancedTable
          data={filteredSurveys}
          columns={columns}
          // selectable={true}
          renderCell={renderCell}
          storageKey="survey-list-table"
          enableExport={true}
          exportFileName="survey-list-data"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search surveys..."
          pagination={true}
          pageSize={10}
          leftActions={
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <Button 
                onClick={handleAddSurvey}
                className="flex items-center gap-2 bg-[#F2EEE9] text-[#BF213E] border-0 hover:bg-[#F2EEE9]/80"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          }
          rightActions={
            <Button variant="outline" className="h-[36px] w-[36px] p-0 border-gray-300 text-gray-700 flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </Button>
          }
        />
      </div>
    </div>
  );
};