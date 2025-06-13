
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Settings, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddBusinessModal } from "@/components/AddBusinessModal";
import { BusinessFilterModal } from "@/components/BusinessFilterModal";

const businessData = [
  {
    id: 1,
    companyName: "7Star Internet Services",
    category: "Internet Services",
    subCategory: "",
    contactPerson: "Irshad Hashmi",
    mobile: "+91 - 9355113406",
    keyOfferings: "",
    status: "Active"
  },
  {
    id: 2,
    companyName: "Adani Electricity",
    category: "Electricity",
    subCategory: "",
    contactPerson: "Adani Helpline Number",
    mobile: "+91 -",
    keyOfferings: "",
    status: "Active"
  },
  {
    id: 3,
    companyName: "Birla",
    category: "Furniture",
    subCategory: "",
    contactPerson: "Harry",
    mobile: "+91 - 1354765432",
    keyOfferings: "",
    status: "Active"
  },
  {
    id: 4,
    companyName: "Himanshu Civil Contractor",
    category: "Furniture",
    subCategory: "",
    contactPerson: "Himanshu",
    mobile: "+91 - 9821748888",
    keyOfferings: "",
    status: "Active"
  },
  {
    id: 5,
    companyName: "Ravi Grant Road",
    category: "Laptop Repairer",
    subCategory: "",
    contactPerson: "Ravi",
    mobile: "+91 - 9920104466",
    keyOfferings: "",
    status: "Active"
  },
  {
    id: 6,
    companyName: "Siddhi Arts",
    category: "Print & Media",
    subCategory: "",
    contactPerson: "Santosh",
    mobile: "+91 - 8108048881",
    keyOfferings: "",
    status: "Active"
  }
];

export const BusinessDirectoryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const filteredBusinesses = businessData.filter(business =>
    business.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Business Directory</span>
        <span>{">"}</span>
        <span className="text-gray-900 font-medium">Business Directory List</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">BUSINESS DIRECTORY</h1>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-purple-700 hover:bg-purple-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/experience/business/setup'}
            className="border-purple-700 text-purple-700 hover:bg-purple-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Setup
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsFilterModalOpen(true)}
            className="border-purple-700 text-purple-700 hover:bg-purple-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search businesses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>View</TableHead>
              <TableHead>Company Logo</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sub Category</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Key Offerings</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBusinesses.map((business) => (
              <TableRow key={business.id}>
                <TableCell>
                  <Eye className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                </TableCell>
                <TableCell>
                  <div className="w-8 h-8 bg-gray-100 rounded border"></div>
                </TableCell>
                <TableCell className="font-medium">{business.companyName}</TableCell>
                <TableCell>{business.category}</TableCell>
                <TableCell>{business.subCategory}</TableCell>
                <TableCell>{business.contactPerson}</TableCell>
                <TableCell>{business.mobile}</TableCell>
                <TableCell>{business.keyOfferings}</TableCell>
                <TableCell>
                  <Badge 
                    variant="default" 
                    className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                  >
                    {business.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <AddBusinessModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      <BusinessFilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />
    </div>
  );
};
