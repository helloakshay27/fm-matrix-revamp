import React, { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Edit, Copy, Eye, Share2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { useToast } from "@/hooks/use-toast";
import { apiClient } from '@/utils/apiClient';
import { SurveyListFilterModal } from '@/components/SurveyListFilterModal';
import { SurveySelectionPanel } from '@/components/SurveyActionModal';
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

interface FilterState {
  surveyName: string;
  categoryId: string;
}

export const SurveyListDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
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
      console.log('Survey data response:', response.data);
      const surveyData = response.data || [];
      setSurveys(surveyData);
      
      // Store all surveys when no filters are applied
      if (!filters) {
        setAllSurveys(surveyData);
      }
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredSurveys.map(survey => survey.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleAction = (action: string, item: SurveyItem) => {
    console.log(`${action} action for survey ${item.id}`);
    if (action === 'Edit') {
      navigate(`/maintenance/survey/edit/${item.id}`);
    } else if (action === 'View') {
      navigate(`/maintenance/survey/details/${item.id}`);
    } else {
      toast({
        title: `${action} Action`,
        description: `${action} action performed for survey ${item.id}`
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
      description: `Survey status changed to ${newStatus}`
    });
  };

  const handleRowAction = (action: string, surveyId: number) => {
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
    // { key: 'snag_audit_category', label: 'Ticket Category', sortable: true, draggable: true },
    // { key: 'snag_audit_sub_category', label: 'Sub Category', sortable: true, draggable: true }, // Hidden
    { key: 'questions_count', label: 'No. of Associations', sortable: true, draggable: true },
    // { key: 'status', label: 'Status', sortable: true, draggable: true } // Hidden
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
      case 'snag_audit_sub_category':
        return item.snag_audit_sub_category || '-';
      case 'questions_count':
        return <div className="text-center">{item.questions_count}</div>;
      default:
        return item[columnKey as keyof SurveyItem];
    }
  };

  // Filter surveys based on search term (API filtering handles the main filters)
  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.snag_audit_category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Get selected survey objects for the panel
  const selectedSurveyObjects = filteredSurveys.filter(survey => 
    selectedItems.includes(survey.id.toString())
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
          {/* <p className="text-muted-foreground text-sm mb-2">
            Survey &gt; Survey List
          </p> */}
          <Heading level="h1" variant="default">Survey List</Heading>
        </div>
      </div>
      
      {/* Enhanced Survey List Table */}
      <div>
        <EnhancedTable
          data={filteredSurveys}
          columns={columns}
          selectable={true}
          selectedItems={selectedItems}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          getItemId={(item) => item.id.toString()}
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

      {/* Survey Selection Panel */}
      <SurveySelectionPanel
        selectedSurveys={selectedItems}
        selectedSurveyObjects={selectedSurveyObjects}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
};