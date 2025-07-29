import React, { useState } from 'react';
import { SurveyListTable } from '../components/SurveyListTable';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Filter, Download, RotateCcw, Search, Edit, Copy, Eye, Share2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export const SurveyListDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [surveys, setSurveys] = useState([
    {
      id: "12345",
      title: "Survey Title 123",
      ticketCreation: true,
      ticketCategory: "Category 123",
      ticketLevel: "Survey",
      noOfAssociation: 2,
      typeOfSurvey: "QR",
      status: "Active",
      validFrom: "30/06/2025",
      validTo: "01/07/2025"
    },
    {
      id: "12346",
      title: "Customer Satisfaction Survey",
      ticketCreation: false,
      ticketCategory: "Feedback",
      ticketLevel: "Question",
      noOfAssociation: 3,
      typeOfSurvey: "Link",
      status: "Draft",
      validFrom: "15/07/2025",
      validTo: "15/08/2025"
    },
    {
      id: "12347",
      title: "Product Quality Assessment",
      ticketCreation: true,
      ticketCategory: "Quality",
      ticketLevel: "Survey",
      noOfAssociation: 4,
      typeOfSurvey: "Link",
      status: "Published",
      validFrom: "01/08/2025",
      validTo: "31/08/2025"
    },
    {
      id: "12348",
      title: "Employee Engagement Survey",
      ticketCreation: true,
      ticketCategory: "HR",
      ticketLevel: "Survey",
      noOfAssociation: 3,
      typeOfSurvey: "QR",
      status: "Inactive",
      validFrom: "10/06/2025",
      validTo: "10/07/2025"
    },
    {
      id: "12349",
      title: "Market Research Survey",
      ticketCreation: false,
      ticketCategory: "Research",
      ticketLevel: "Question",
      noOfAssociation: 0,
      typeOfSurvey: "Link",
      status: "Draft",
      validFrom: "20/07/2025",
      validTo: "20/09/2025"
    },
    {
      id: "12350",
      title: "Service Quality Survey",
      ticketCreation: true,
      ticketCategory: "Service",
      ticketLevel: "Survey",
      noOfAssociation: 5,
      typeOfSurvey: "QR",
      status: "Published",
      validFrom: "05/08/2025",
      validTo: "05/10/2025"
    },
    {
      id: "12351",
      title: "Training Evaluation Survey",
      ticketCreation: false,
      ticketCategory: "Training",
      ticketLevel: "Question",
      noOfAssociation: 2,
      typeOfSurvey: "Link",
      status: "Inactive",
      validFrom: "25/06/2025",
      validTo: "25/07/2025"
    },
    {
      id: "12352",
      title: "Event Feedback Survey",
      ticketCreation: true,
      ticketCategory: "Events",
      ticketLevel: "Survey",
      noOfAssociation: 1,
      typeOfSurvey: "QR",
      status: "Active",
      validFrom: "12/07/2025",
      validTo: "12/08/2025"
    },
    {
      id: "12353",
      title: "Brand Awareness Survey",
      ticketCreation: false,
      ticketCategory: "Marketing",
      ticketLevel: "Question",
      noOfAssociation: 6,
      typeOfSurvey: "Link",
      status: "Published",
      validFrom: "18/07/2025",
      validTo: "18/09/2025"
    },
    {
      id: "12354",
      title: "Website Usability Survey",
      ticketCreation: true,
      ticketCategory: "UX",
      ticketLevel: "Survey",
      noOfAssociation: 4,
      typeOfSurvey: "QR",
      status: "Active",
      validFrom: "22/07/2025",
      validTo: "22/08/2025"
    },
    {
      id: "12355",
      title: "Customer Support Survey",
      ticketCreation: true,
      ticketCategory: "Support",
      ticketLevel: "Survey",
      noOfAssociation: 7,
      typeOfSurvey: "Link",
      status: "Draft",
      validFrom: "28/07/2025",
      validTo: "28/08/2025"
    },
    {
      id: "12356",
      title: "Product Launch Survey",
      ticketCreation: false,
      ticketCategory: "Product",
      ticketLevel: "Question",
      noOfAssociation: 3,
      typeOfSurvey: "QR",
      status: "Published",
      validFrom: "02/08/2025",
      validTo: "02/09/2025"
    },
    {
      id: "12357",
      title: "Annual Review Survey",
      ticketCreation: true,
      ticketCategory: "Review",
      ticketLevel: "Survey",
      noOfAssociation: 8,
      typeOfSurvey: "Link",
      status: "Inactive",
      validFrom: "15/08/2025",
      validTo: "15/10/2025"
    },
    {
      id: "12358",
      title: "Mobile App Feedback Survey",
      ticketCreation: false,
      ticketCategory: "Mobile",
      ticketLevel: "Question",
      noOfAssociation: 2,
      typeOfSurvey: "QR",
      status: "Active",
      validFrom: "25/08/2025",
      validTo: "25/09/2025"
    },
    {
      id: "12359",
      title: "Social Media Survey",
      ticketCreation: true,
      ticketCategory: "Social",
      ticketLevel: "Survey",
      noOfAssociation: 5,
      typeOfSurvey: "Link",
      status: "Published",
      validFrom: "30/08/2025",
      validTo: "30/10/2025"
    }
  ]);

  const handleAddSurvey = () => {
    navigate('/maintenance/survey/add');
  };

  const handleTicketCreationToggle = (item: any) => {
    setSurveys(prevSurveys => 
      prevSurveys.map((survey) => 
        survey.id === item.id ? { ...survey, ticketCreation: !survey.ticketCreation } : survey
      )
    );
    toast({
      title: "Ticket Creation Updated",
      description: "Ticket creation setting has been updated successfully"
    });
  };

  const handleStatusChange = (item: any, newStatus: string) => {
    setSurveys(prevSurveys => 
      prevSurveys.map((survey) => 
        survey.id === item.id ? { ...survey, status: newStatus } : survey
      )
    );
    toast({
      title: "Status Updated",
      description: `Survey status changed to ${newStatus}`
    });
  };

  const handleAction = (action: string, surveyId: string) => {
    console.log(`${action} action for survey ${surveyId}`);
    toast({
      title: `${action} Action`,
      description: `${action} action performed for survey ${surveyId}`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'text-green-600';
      case 'Draft':
        return 'text-yellow-600';
      case 'Inactive':
        return 'text-red-600';
      case 'Active':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const statusOptions = ['Active', 'Draft', 'Published', 'Inactive'];

  const columns = [
    { key: 'actions', label: 'Actions', sortable: false, draggable: false },
    { key: 'id', label: 'ID', sortable: true, draggable: true },
    { key: 'title', label: 'Survey Title', sortable: true, draggable: true },
    { key: 'ticketCreation', label: 'Ticket Creation', sortable: false, draggable: true },
    { key: 'ticketCategory', label: 'Ticket Category', sortable: true, draggable: true },
    { key: 'ticketLevel', label: 'Ticket Level', sortable: true, draggable: true },
    { key: 'noOfAssociation', label: 'No. Of Association', sortable: true, draggable: true },
    { key: 'typeOfSurvey', label: 'Type Of Survey', sortable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, draggable: true },
    { key: 'validFrom', label: 'Valid From', sortable: true, draggable: true },
    { key: 'validTo', label: 'Valid To', sortable: true, draggable: true }
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex space-x-1">
            <button 
              onClick={() => navigate(`/maintenance/survey/edit/${item.id}`)}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleAction('Copy', item.id)}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleAction('View', item.id)}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleAction('Share', item.id)}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        );
      case 'ticketCreation':
        return (
          <div className="flex items-center">
            <div 
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                item.ticketCreation ? 'bg-green-400' : 'bg-gray-300'
              }`} 
              onClick={() => handleTicketCreationToggle(item)}
            >
              <span 
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  item.ticketCreation ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </div>
          </div>
        );
      case 'status':
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded">
              <span className={`font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border shadow-lg z-50">
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(item, status)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <span className={getStatusColor(status)}>{status}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case 'noOfAssociation':
        return <div className="text-center">{item[columnKey]}</div>;
      default:
        return item[columnKey];
    }
  };


  // Filter surveys based on search term
  const filteredSurveys = surveys.filter(survey =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.ticketCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      {/* Action Buttons Row - Responsive */}

      {/* Enhanced Survey List Table */}
      <div>
        <EnhancedTable
          data={filteredSurveys}
          columns={columns}
          selectable={true}
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
            <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          }
        />
      </div>
    </div>
  );
};
