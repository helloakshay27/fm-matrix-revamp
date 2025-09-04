import React, { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Edit, Copy, Eye, Share2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { useToast } from "@/hooks/use-toast";
import { apiClient } from '@/utils/apiClient';
import { SurveyListFilterModal } from '@/components/SurveyListFilterModal';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface SurveyItem {
  id: number;
  name: string;
  snag_audit_category: string | null;
  snag_audit_sub_category: string | null;
  questions_count: number;
  active: number;
  check_type: string;
  snag_questions?: Array<{
    id: number;
    qtype: string;
    descr: string;
    checklist_id: number;
    img_mandatory: boolean;
    quest_mandatory: boolean;
    no_of_associations: number;
    ticket_configs: {
      category: string;
      category_id: number;
      assigned_to: string;
      assigned_to_id: number;
      tag_type: string | null;
      active: boolean;
      tag_created_at: string;
      tag_updated_at: string;
    };
  }>;
}

interface FilterState {
  surveyName: string;
  categoryId: string;
}

export const SurveyListDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    surveyName: '',
    categoryId: 'all'
  });
  const [allSurveys, setAllSurveys] = useState<SurveyItem[]>([]); // Store all surveys for filtering

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const fetchSurveyData = async (filters?: FilterState) => {
    try {
      setLoading(true);
      // Get the site_id from localStorage or use a default value
      const siteId = localStorage.getItem('site_id') || '2189';
      
      // Build query parameters for filtering
      let url = `/pms/admin/snag_checklists.json?site_id=${siteId}`;
      
      if (filters) {
        if (filters.surveyName) {
          url += `&q[name_cont]=${encodeURIComponent(filters.surveyName)}`;
        }
        if (filters.categoryId && filters.categoryId !== 'all') {
          url += `&q[snag_audit_category_id_eq]=${filters.categoryId}`;
        }
      } else {
        // Default params when no filters
        url += `&q[name_cont]=&q[snag_audit_sub_category_id_eq]=&q[snag_audit_category_id_eq]=`;
      }
      
      const response = await apiClient.get(url);
      console.log('Question data response:', response.data);
      const surveyData = response.data || [];
      console.log('First survey item:', surveyData[0]); // Debug log
      setSurveys(surveyData);
      
      // Store all surveys when no filters are applied
      if (!filters) {
        setAllSurveys(surveyData);
      }
    } catch (error) {
      console.error('Error fetching Question data:', error);
      setSurveys([]); // Set empty array on error
      toast({
        title: "Error",
        description: "Failed to fetch Question data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSurvey = () => {
    navigate('/master/survey/add');
  };

  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    // Fetch filtered data from API
    fetchSurveyData(filters);
  };

  const handleResetFilters = () => {
    setAppliedFilters({
      surveyName: '',
      categoryId: 'all'
    });
    // Fetch all data without filters
    fetchSurveyData();
  };

  const handleAction = (action: string, item: SurveyItem) => {
    console.log(`${action} action for Question ${item.id}`);
    if (action === 'Edit') {
      navigate(`/maintenance/survey/edit/${item.id}`);
    } else if (action === 'View') {
      navigate(`/maintenance/survey/details/${item.id}`);
    } else {
      toast({
        title: `${action} Action`,
        description: `${action} action performed for Question ${item.id}`
      });
    }
  };

  const handleStatusChange = (item: SurveyItem, newStatus: string) => {
    setSurveys(prevSurveys => 
      prevSurveys.map((survey) => 
        survey.id === item.id ? { ...survey, active: newStatus === 'Active' ? 1 : 0 } : survey
      )
    );
    toast({
      title: "Status Updated",
      description: `Question status changed to ${newStatus}`
    });
  };

  const handleRowAction = (action: string, surveyId: number) => {
    console.log(`${action} action for Question ${surveyId}`);
    if (action === 'Edit') {
      navigate(`/maintenance/survey/edit/${surveyId}`);
    } else if (action === 'View') {
      navigate(`/maintenance/survey/details/${surveyId}`);
    } else {
      toast({
        title: `${action} Action`,
        description: `${action} action performed for Question ${surveyId}`
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
    { key: 'actions', label: 'Actions', sortable: false, draggable: false, defaultVisible: true },
    { key: 'name', label: 'Title/Question Name', sortable: true, draggable: true, defaultVisible: true },
    { key: 'check_type', label: 'Check Type', sortable: true, draggable: true, defaultVisible: true },
    { key: 'questions_count', label: 'No. of Questions', sortable: true, draggable: true, defaultVisible: true },
    { key: 'associations_count', label: 'No. of Associations', sortable: true, draggable: true, defaultVisible: true },
    { key: 'ticket_category', label: 'Ticket Category', sortable: true, draggable: true, defaultVisible: true },
    { key: 'assigned_to', label: 'Assigned To', sortable: true, draggable: true, defaultVisible: true },
    // { key: 'snag_audit_sub_category', label: 'Sub Category', sortable: true, draggable: true, defaultVisible: true },
  ];

  const renderCell = (item: SurveyItem, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex justify-center items-center">
            <button 
              onClick={() => handleRowAction('View', item.id)}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        );
      case 'name':
        return <span>{item.name}</span>;
      case 'check_type':
        return <span className="capitalize">{item.check_type || '-'}</span>;
      case 'questions_count':
        return <div className="text-center">{item.questions_count || 0}</div>;
      case 'associations_count':
        return (
          <div className="text-center">
            {item.snag_questions?.[0]?.no_of_associations || 0}
          </div>
        );
      case 'ticket_category':
        return (
          <span>
            {item.snag_questions?.[0]?.ticket_configs?.category || '-'}
          </span>
        );
      case 'assigned_to':
        return (
          <span>
            {item.snag_questions?.[0]?.ticket_configs?.assigned_to || '-'}
          </span>
        );
      case 'snag_audit_sub_category':
        return <span>{item.snag_audit_sub_category || '-'}</span>;
      case 'status': {
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
      }
      default:
        // Fallback for any other columns
        const value = item[columnKey as keyof SurveyItem];
        return <span>{value !== null && value !== undefined ? String(value) : '-'}</span>;
    }
  };

  // Filter surveys based on search term (API filtering handles the main filters)
  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (survey.snag_audit_category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (survey.snag_audit_sub_category || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Debug logs
  console.log('Filtered surveys:', filteredSurveys);
  console.log('Columns:', columns);

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
          {/* <p className="text-muted-foreground text-sm mb-2">
            Survey &gt; Survey List
          </p> */}
          <Heading level="h1" variant="default">Question Bank</Heading>
        </div>
      </div>
      
      {/* Enhanced Survey List Table */}
      <div>
        <EnhancedTable
          data={filteredSurveys}
          columns={columns}
          selectable={false}
          getItemId={(item) => item.id.toString()}
          renderCell={renderCell}
          storageKey="survey-list-table-v2"
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
          onFilterClick={handleOpenFilterModal}
        />
      </div>

      {/* Filter Modal */}
      <SurveyListFilterModal
        open={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};