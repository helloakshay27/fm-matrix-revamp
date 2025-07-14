
import React, { useState } from 'react';
import { Edit, Copy, Eye, Share2, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { SurveyEnhancedTable, SurveyColumnConfig } from './survey-enhanced-table/SurveyEnhancedTable';

interface SurveyListTableProps {
  searchTerm: string;
}

interface Survey {
  id: string;
  title: string;
  ticketCreation: boolean;
  ticketCategory: string;
  ticketLevel: string;
  noOfAssociation: number;
  typeOfSurvey: string;
  status: string;
  validFrom: string;
  validTo: string;
}

const mockSurveyData: Survey[] = [
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
  }
];

const columns: SurveyColumnConfig[] = [
  { key: 'actions', label: 'Actions', sortable: false, hideable: false, width: '160px' },
  { key: 'id', label: 'ID', sortable: true, hideable: true, width: '100px' },
  { key: 'title', label: 'Survey Title', sortable: true, hideable: true, minWidth: '200px' },
  { key: 'ticketCreation', label: 'Ticket Creation', sortable: false, hideable: true, width: '140px' },
  { key: 'ticketCategory', label: 'Ticket Category', sortable: true, hideable: true, minWidth: '150px' },
  { key: 'ticketLevel', label: 'Ticket Level', sortable: true, hideable: true, width: '120px' },
  { key: 'noOfAssociation', label: 'No. Of Association', sortable: true, hideable: true, width: '140px' },
  { key: 'typeOfSurvey', label: 'Type Of Survey', sortable: true, hideable: true, width: '130px' },
  { key: 'status', label: 'Status', sortable: true, hideable: true, width: '120px' },
  { key: 'validFrom', label: 'Valid From', sortable: true, hideable: true, width: '120px' },
  { key: 'validTo', label: 'Valid To', sortable: true, hideable: true, width: '120px' }
];

export const SurveyListTable = ({ searchTerm }: SurveyListTableProps) => {
  const { toast } = useToast();
  const [surveys, setSurveys] = useState<Survey[]>(mockSurveyData);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  console.log('Survey data:', surveys);
  console.log('First survey status:', surveys[0]?.status);
  console.log('First survey validFrom:', surveys[0]?.validFrom);
  console.log('First survey validTo:', surveys[0]?.validTo);

  const handleTicketCreationToggle = (index: number) => {
    setSurveys(prevSurveys => 
      prevSurveys.map((survey, i) => 
        i === index ? { ...survey, ticketCreation: !survey.ticketCreation } : survey
      )
    );
    toast({
      title: "Ticket Creation Updated",
      description: "Ticket creation setting has been updated successfully"
    });
  };

  const handleStatusChange = (index: number, newStatus: string) => {
    setSurveys(prevSurveys => 
      prevSurveys.map((survey, i) => 
        i === index ? { ...survey, status: newStatus } : survey
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

  const handleRowSelect = (selectedRowIds: string[]) => {
    setSelectedRows(selectedRowIds);
    console.log('Selected rows:', selectedRowIds);
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

  const renderCell = (survey: Survey, columnKey: string, index: number) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handleAction('Edit', survey.id)}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleAction('Copy', survey.id)}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleAction('View', survey.id)}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleAction('Share', survey.id)}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        );
      
      case 'id':
        return <span className="font-medium">{survey.id}</span>;
      
      case 'title':
        return <span>{survey.title}</span>;
      
      case 'ticketCreation':
        return (
          <div className="flex items-center">
            <div 
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                survey.ticketCreation ? 'bg-green-400' : 'bg-gray-300'
              }`} 
              onClick={() => handleTicketCreationToggle(index)}
            >
              <span 
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  survey.ticketCreation ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </div>
          </div>
        );
      
      case 'ticketCategory':
        return <span>{survey.ticketCategory}</span>;
      
      case 'ticketLevel':
        return <span>{survey.ticketLevel}</span>;
      
      case 'noOfAssociation':
        return <span className="text-center block">{survey.noOfAssociation}</span>;
      
      case 'typeOfSurvey':
        return <span>{survey.typeOfSurvey}</span>;
      
      case 'status':
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded">
              <span className={`font-medium ${getStatusColor(survey.status)}`}>
                {survey.status}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border shadow-lg z-50">
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(index, status)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <span className={getStatusColor(status)}>{status}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      
      case 'validFrom':
        return <span>{survey.validFrom}</span>;
      
      case 'validTo':
        return <span>{survey.validTo}</span>;
      
      default:
        return <span>{(survey as any)[columnKey]}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Show selected rows count and bulk actions */}
      {selectedRows.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              {selectedRows.length} survey{selectedRows.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button 
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  toast({
                    title: "Bulk Action",
                    description: `Bulk action performed on ${selectedRows.length} surveys`
                  });
                }}
              >
                Bulk Edit
              </button>
              <button 
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  toast({
                    title: "Bulk Delete",
                    description: `${selectedRows.length} surveys marked for deletion`
                  });
                }}
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Table */}
      <SurveyEnhancedTable
        data={surveys}
        columns={columns}
        searchTerm={searchTerm}
        onRowSelect={handleRowSelect}
        renderCell={renderCell}
        className="border border-[#D5DbDB]"
      />
    </div>
  );
};
