
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddCompanyPartnerModal } from "@/components/AddCompanyPartnerModal";
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';

const columns: ColumnConfig[] = [
  {
    key: "companyName",
    label: "Company Name",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "companyBanner",
    label: "Company Banner",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
]

export const CompanyPartnersSetupDashboard = () => {
  const navigate = useNavigate()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const partnersData = [
    {
      id: 1,
      companyName: "L&T",
      companyBanner: "/placeholder.svg",
      status: true
    },
    {
      id: 2,
      companyName: "Deloitte",
      companyBanner: "/placeholder.svg",
      status: true
    },
    {
      id: 3,
      companyName: "Credable.",
      companyBanner: "/placeholder.svg",
      status: true
    },
    {
      id: 4,
      companyName: "test company",
      companyBanner: "/placeholder.svg",
      status: false
    },
    {
      id: 5,
      companyName: "Vinayak T 1",
      companyBanner: "/placeholder.svg",
      status: false
    },
    {
      id: 6,
      companyName: "Test3",
      companyBanner: "/placeholder.svg",
      status: false
    }
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "status":
        return (
          <Switch
            checked={item.status}
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
        );
      default:
        return item[columnKey] || "-";
    }
  };

  const renderActions = (item: any) => {
    return (
      <div className="flex justify-center gap-2">
        {/* <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() => navigate(`/settings/community-modules/testimonial-setup/${item.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button> */}
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    )
  };

  const leftActions = (
    <>
      <Button
        className="bg-[#C72030] hover:bg-[#A01020] text-white"
        onClick={() => setIsAddModalOpen(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </>
  );

  return (
    <div className="p-6">
      <EnhancedTable
        data={partnersData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
      />

      {/* Add Company Partner Modal */}
      <AddCompanyPartnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
