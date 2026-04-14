import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Pencil } from "lucide-react";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import axios from "axios";

interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  userLimit: string;
  renewalTerms: string;
  hsnCode: string
  amenities: string[];
  createdOn: string;
  createdBy: string;
  status: string;
  active: boolean;
}

const columns: ColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    draggable: true,
  },
  {
    key: 'name',
    label: 'Plan Name',
    sortable: true,
    draggable: true,
  },
  {
    key: 'price',
    label: 'Price',
    sortable: true,
    draggable: true,
  },
  {
    key: 'userLimit',
    label: 'User Limit',
    sortable: true,
    draggable: true,
  },
  {
    key: 'renewalTerms',
    label: 'Membership Type',
    sortable: true,
    draggable: true,
  },
  {
    key: 'hsnCode',
    label: 'HSN Code',
    sortable: true,
    draggable: true,
  },
  {
    key: 'createdOn',
    label: 'Created On',
    sortable: true,
    draggable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    draggable: true,
  },
];

const transformData = (data) => {
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price ? `₹${item.price}` : '',
    userLimit: item.user_limit,
    renewalTerms: item.renewal_terms ? item.renewal_terms.charAt(0).toUpperCase() + item.renewal_terms.slice(1) : '',
    hsnCode: item.hsn_code || '',
    status: item.active ? 'Active' : 'Inactive',
    active: item.active,
    createdOn: item.created_at ? (() => {
      // Handles ISO string, 'YYYY-MM-DD', 'YYYY-MM-DD, HH:mm', 'YYYY-MM-DD HH:mm'
      let formattedDate = '';
      let formattedTime = '';
      // Try ISO or Date parsing
      const dateObj = new Date(item.created_at);
      if (!isNaN(dateObj.getTime())) {
        const d = String(dateObj.getDate()).padStart(2, '0');
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const y = dateObj.getFullYear();
        formattedDate = `${d}/${m}/${y}`;
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const mins = String(dateObj.getMinutes()).padStart(2, '0');
        formattedTime = `${hours}:${mins}`;
        return `${formattedDate}, ${formattedTime}`;
      }
      // fallback: try to split manually
      let datePart = item.created_at;
      let timePart = '';
      if (item.created_at.includes(',')) {
        [datePart, timePart] = item.created_at.split(',').map(s => s.trim());
      } else if (item.created_at.includes(' ')) {
        [datePart, timePart] = item.created_at.split(' ').map(s => s.trim());
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        const [year, month, day] = datePart.split('-');
        formattedDate = `${day}/${month}/${year}`;
      } else {
        formattedDate = item.created_at;
      }
      if (timePart) {
        return `${formattedDate}, ${timePart}`;
      }
      return formattedDate;
    })() : '',
  }));
}

export const MembershipPlanDashboard = () => {
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [membershipPlanData, setMembershipPlanData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [pagination, setPagination] = useState({
    current_page: pageFromUrl,
    total_count: 0,
    total_pages: 0,
  });

  const fetchMembershipPlanData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://${baseUrl}/membership_plans.json`, {
        params: {
          page: page,
          per_page: 10,
        },
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      const plans = Array.isArray(response.data.plans) ? response.data.plans : response.data.plans || [];
      setMembershipPlanData(transformData(plans));

      // Update pagination from response
      if (response.data.pagination) {
        setPagination({
          current_page: response.data.pagination.current_page || 1,
          total_count: response.data.pagination.total_count || 0,
          total_pages: response.data.pagination.total_pages || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching membership plan data:", error);
      toast.error("Failed to fetch membership plan data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembershipPlanData(pageFromUrl);
  }, [pageFromUrl]);

  const handleAddMembership = () => {
    navigate("/settings/vas/membership-plan/setup/add");
  };

  const handleStatusToggle = async (plan: MembershipPlan) => {
    const loadingToast = toast.loading(`${plan.active ? 'Deactivating' : 'Activating'} ${plan.name}...`);
    try {
      const newStatus = !plan.active;

      const response = await axios.put(`https://${baseUrl}/membership_plans/${plan.id}.json`,
        { membership_plan: { active: newStatus } },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200 || response.status === 204) {
        toast.success('Status updated successfully', { id: loadingToast });
        fetchMembershipPlanData(pagination.current_page);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error("Error updating membership plan status:", error);
      toast.error('Failed to update status', { id: loadingToast });
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/settings/vas/membership-plan/setup/details/${id}`);
  };

  const handleEditDetails = (id: string) => {
    navigate(`/settings/vas/membership-plan/setup/edit/${id}`);
  };

  const renderCell = (item: MembershipPlan, columnKey: string) => {
    if (columnKey === 'status') {
      const active = item.active;
      return (
        <div className="flex items-center gap-3">
          <div
            onClick={() => handleStatusToggle(item)}
            className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${active ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
          </div>
          {/* <span className={`text-xs font-medium ${active ? 'text-green-600' : 'text-red-600'}`}>
            {active ? 'Active' : 'Inactive'}
          </span> */}
        </div>
      );
    }

    switch (columnKey) {
      default:
        return item[columnKey as keyof MembershipPlan]?.toString() || '--';
    }
  };

  const renderActions = (plan: MembershipPlan) => (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleViewDetails(plan.id)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleEditDetails(plan.id)}
      >
        <Pencil className="w-4 h-4" />
      </Button>
    </div>
  );

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) {
      return;
    }
    try {
      setSearchParams({ page: page.toString() });
      setPagination((prev) => ({ ...prev, current_page: page }));
      await fetchMembershipPlanData(page);
    } catch (error) {
      console.error("Error changing page:", error);
      toast.error("Failed to load page data. Please try again.");
    }
  };

  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) {
      return null;
    }
    const items = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      items.push(
        <PaginationItem key={1} className="cursor-pointer">
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            aria-disabled={loading}
            className={loading ? "pointer-events-none opacity-50" : ""}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                aria-disabled={loading}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                aria-disabled={loading}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find((item) => item.key === i.toString())) {
            items.push(
              <PaginationItem key={i} className="cursor-pointer">
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                  aria-disabled={loading}
                  className={loading ? "pointer-events-none opacity-50" : ""}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              aria-disabled={loading}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              aria-disabled={loading}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const leftActions = (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => setShowActionPanel(true)}
        className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 border-0"
      >
        <Plus className="w-4 h-4" />
        Action
      </Button>
    </div>
  );

  return (
    <div className="p-6 bg-white">
      {showActionPanel && (
        <SelectionPanel
          onAdd={handleAddMembership}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}
      <div className="rounded-lg shadow-sm p-1 bg-transparent">
        <EnhancedTable
          data={membershipPlanData}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          storageKey="membership-plan-table"
          className="min-w-full"
          emptyMessage={loading ? "Loading membership plan data..." : "No membership plan data found"}
          leftActions={leftActions}
          enableSearch={true}
          enableSelection={false}
          hideTableExport={true}
          loading={loading}
        />
      </div>

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                className={pagination.current_page === 1 || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                className={pagination.current_page === pagination.total_pages || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
