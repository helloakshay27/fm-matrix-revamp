import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Filter,
  Edit,
  Copy,
  Eye,
  Share2,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EnhancedTable } from "../components/enhanced-table/EnhancedTable";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/utils/apiClient";
import { SurveyListFilterModal } from "@/components/SurveyListFilterModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SurveyItem {
  id: number;
  name: string;
  snag_audit_category: string | null;
  snag_audit_sub_category: string | null;
  questions_count: number;
  active: number;
  check_type: string;
  ticket_configs?: {
    category: string;
    category_id: number;
    assigned_to: string;
    assigned_to_id: number;
    tag_type: string | null;
    active: boolean;
    tag_created_at: string;
    tag_updated_at: string;
  };
  snag_questions?: Array<{
    id: number;
    qtype: string;
    descr: string;
    checklist_id: number;
    img_mandatory: boolean;
    quest_mandatory: boolean;
    no_of_associations: number;
  }>;
}

interface FilterState {
  surveyName: string;
  categoryId: string;
  checkType: string;
}

export const SurveyListDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    surveyName: "",
    categoryId: "all",
    checkType: "all",
  });
  const [allSurveys, setAllSurveys] = useState<SurveyItem[]>([]);

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const getCurrentSiteId = (): string => {
    return (
      localStorage.getItem("selectedSiteId") ||
      new URLSearchParams(window.location.search).get("site_id")
    );
  };

  const fetchSurveyData = useCallback(
    async (filters?: FilterState) => {
      try {
        setLoading(true);
        const siteId = getCurrentSiteId();
        let url = `/pms/admin/snag_checklists.json?site_id=${siteId}`;

        if (filters) {
          if (filters.surveyName) {
            url += `&q[name_cont]=${encodeURIComponent(filters.surveyName)}`;
          }
          if (filters.categoryId && filters.categoryId !== "all") {
            url += `&q[generic_tag_category_name_eq]=${filters.categoryId}`;
          }
          if (filters.checkType && filters.checkType !== "all") {
            url += `&q[check_type_eq]=${filters.checkType}`;
          }
        } else {
          url += `&q[name_cont]=&q[snag_audit_sub_category_id_eq]=&q[generic_tag_category_name_eq]=&q[check_type_eq]=`;
        }

        const response = await apiClient.get(url);
        console.log("Question data response:", response.data);
        const surveyData = response.data || [];
        console.log("First survey item:", surveyData[0]);

        setSurveys((prevSurveys) => {
          if (JSON.stringify(prevSurveys) === JSON.stringify(surveyData)) {
            return prevSurveys;
          }
          return surveyData;
        });

        if (!filters) {
          setAllSurveys(surveyData);
        }
      } catch (error) {
        console.error("Error fetching Question data:", error);
        setSurveys([]);
        toast({
          title: "Error",
          description: "Failed to fetch Question data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const handleAddSurvey = () => {
    const siteId = getCurrentSiteId();
    navigate(`/master/survey/add?site_id=${siteId}`);
  };

  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = useCallback(
    (filters: FilterState) => {
      setAppliedFilters(filters);
      fetchSurveyData(filters);
    },
    [fetchSurveyData]
  );

  const handleResetFilters = useCallback(() => {
    const defaultFilters = {
      surveyName: "",
      categoryId: "all",
      checkType: "all",
    };

    if (JSON.stringify(appliedFilters) !== JSON.stringify(defaultFilters)) {
      setAppliedFilters(defaultFilters);
      fetchSurveyData();
    }
  }, [appliedFilters, fetchSurveyData]);

  const handleExportSurveys = useCallback(async () => {
    try {
      const siteId = getCurrentSiteId();
      let url = `/pms/admin/snag_checklists.xlsx?site_id=${siteId}&export=true`;

      if (appliedFilters.surveyName) {
        url += `&q[name_cont]=${encodeURIComponent(appliedFilters.surveyName)}`;
      }
      if (appliedFilters.categoryId && appliedFilters.categoryId !== "all") {
        url += `&q[generic_tag_category_name_eq]=${appliedFilters.categoryId}`;
      }
      if (appliedFilters.checkType && appliedFilters.checkType !== "all") {
        url += `&q[check_type_eq]=${appliedFilters.checkType}`;
      }

      const response = await apiClient.get(url, { responseType: "blob" });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "survey-list-data.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Export Successful",
        description: "Survey data has been exported successfully",
      });
    } catch (error) {
      console.error("Error exporting surveys:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export survey data",
        variant: "destructive",
      });
    }
  }, [appliedFilters, toast]);

  const handleAction = (action: string, item: SurveyItem) => {
    console.log(`${action} action for Question ${item.id}`);
    const siteId = getCurrentSiteId();
    if (action === "Edit") {
      navigate(`/master/survey/edit/${item.id}?site_id=${siteId}`);
    } else if (action === "View") {
      navigate(`/master/survey/details/${item.id}?site_id=${siteId}`);
    } else {
      toast({
        title: `${action} Action`,
        description: `${action} action performed for Question ${item.id}`,
      });
    }
  };

  const handleStatusChange = (item: SurveyItem, newStatus: string) => {
    setSurveys((prevSurveys) =>
      prevSurveys.map((survey) =>
        survey.id === item.id
          ? { ...survey, active: newStatus === "Active" ? 1 : 0 }
          : survey
      )
    );
    toast({
      title: "Status Updated",
      description: `Question status changed to ${newStatus}`,
    });
  };

  const handleRowAction = (action: string, surveyId: number) => {
    console.log(`${action} action for Question ${surveyId}`);
    const siteId = getCurrentSiteId();
    if (action === "Edit") {
      navigate(`/master/survey/edit/${surveyId}?site_id=${siteId}`);
    } else if (action === "View") {
      navigate(`/master/survey/details/${surveyId}?site_id=${siteId}`);
    } else {
      toast({
        title: `${action} Action`,
        description: `${action} action performed for Question ${surveyId}`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-600";
      case "Inactive":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const statusOptions = ["Active", "Inactive"];

  const columns = useMemo(
    () => [
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        draggable: false,
        defaultVisible: true,
      },
      {
        key: "name",
        label: "Title/Question Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
      },
      {
        key: "check_type",
        label: "Check Type",
        sortable: true,
        draggable: true,
        defaultVisible: true,
      },
      {
        key: "questions_count",
        label: "No. of Questions",
        sortable: true,
        draggable: true,
        defaultVisible: true,
      },
      {
        key: "associations_count",
        label: "No. of Associations",
        sortable: true,
        draggable: true,
        defaultVisible: true,
      },
      {
        key: "ticket_category",
        label: "Ticket Category",
        sortable: true,
        draggable: true,
        defaultVisible: true,
      },
      // {
      //   key: "assigned_to",
      //   label: "Assigned To",
      //   sortable: true,
      //   draggable: true,
      //   defaultVisible: true,
      // },
    ],
    []
  );

  const renderCell = useCallback(
    (item: SurveyItem, columnKey: string) => {
      switch (columnKey) {
        case "actions":
          return (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handleRowAction("View", item.id)}
                className="p-1 text-black-600 hover:text-black-800"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRowAction("Edit", item.id)}
                className="p-1 text-black-600 hover:text-black-800"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          );
        case "name":
          return <span>{item.name}</span>;
        case "check_type":
          return <span className="capitalize">{item.check_type || "-"}</span>;
        case "questions_count":
          return <div className="text-center">{item.questions_count || 0}</div>;
        case "associations_count":
          return (
            <div className="text-center">
              {item.snag_questions?.[0]?.no_of_associations || 0}
            </div>
          );
        case "ticket_category":
          return (
            <span>
              {item.ticket_configs?.category || "-"}
            </span>
          );
        case "assigned_to":
          return (
            <span>
              {item.ticket_configs?.assigned_to || "-"}
            </span>
          );
        case "snag_audit_sub_category":
          return <span>{item.snag_audit_sub_category || "-"}</span>;
        case "status": {
          const status = item.active === 1 ? "Active" : "Inactive";
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
                    <span className={getStatusColor(statusOption)}>
                      {statusOption}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
        default:
          const value = item[columnKey as keyof SurveyItem];
          return (
            <span>
              {value !== null && value !== undefined ? String(value) : "-"}
            </span>
          );
      }
    },
    [navigate, toast]
  );

  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      const matchesSearch =
        survey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (survey.snag_audit_category || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (survey.snag_audit_sub_category || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [surveys, searchTerm]);

  console.log("Filtered surveys:", filteredSurveys);
  console.log("Columns:", columns);

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
          <Heading level="h1" variant="default">
            Question Bank
          </Heading>
        </div>
      </div>

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
          handleExport={handleExportSurveys}
        />
      </div>

      <SurveyListFilterModal
        open={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        currentFilters={appliedFilters}
      />
    </div>
  );
};
