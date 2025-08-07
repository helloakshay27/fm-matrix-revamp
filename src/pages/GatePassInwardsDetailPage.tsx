import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';

export const GatePassInwardsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample data - in real app, this would be fetched based on the ID
  const inwardData = [
    {
      id: "4102",
      type: "",
      category: "Visitor",
      personName: "Aniket",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10027",
      itemDetails: "- Drill machine serials 1244 -"
    },
    {
      id: "1083",
      type: "Faulty",
      category: "Vendor",
      personName: "Haven infoline",
      profileImage: "/placeholder.svg",
      passNo: "143",
      modeOfTransport: "By Hand",
      lrNo: "Bbvbb",
      tripId: "0",
      gateEntry: "7-10026",
      itemDetails: "RAN - 1 - MW - -"
    },
    {
      id: "864",
      type: "SRN",
      category: "Visitor",
      personName: "Yash",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10025",
      itemDetails: "Transmission - - MW - -"
    },
    {
      id: "863",
      type: "SRN",
      category: "Staff",
      personName: "demo demo",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10024",
      itemDetails: "Transmission - - 5 Transmission - -"
    },
    {
      id: "862",
      type: "Fresh",
      category: "Visitor",
      personName: "Prashant",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10023",
      itemDetails: "Transmission - - Transmission - - Transmission - -"
    },
    {
      id: "861",
      type: "SRN",
      category: "Visitor",
      personName: "bilal",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10022",
      itemDetails: "MW - - Transmission - - Transmission - -"
    },
    {
      id: "860",
      type: "Faulty",
      category: "Visitor",
      personName: "Saurabh",
      profileImage: "/placeholder.svg",
      passNo: "",
      modeOfTransport: "By Hand",
      lrNo: "",
      tripId: "",
      gateEntry: "7-10021",
      itemDetails: "MW - - Transmission - -"
    }
  ];

  const selectedEntry = inwardData.find(entry => entry.id === id);

  if (!selectedEntry) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Entry Not Found</h1>
          <Button onClick={() => navigate('/security/gate-pass/inwards')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inward List
          </Button>
        </div>
      </div>
    );
  }

  // Sample item data based on the selected entry
  const itemsData = [
    {
      sNo: "01",
      itemName: selectedEntry.type || "Faulty",
      itemCategory: "Materials",
      itemNameDetail: "Credit",
      unit: "10",
      quantity: "120kg",
      description: "---",
      attachment: "📎",
      updates: "Receive"
    },
    {
      sNo: "02",
      itemName: selectedEntry.type || "faulty",
      itemCategory: "Materials",
      itemNameDetail: "Debit",
      unit: "12",
      quantity: "180kg",
      description: "---",
      attachment: "📎",
      updates: "Receive"
    },
    {
      sNo: "03",
      itemName: selectedEntry.type || "faulty",
      itemCategory: "Materials",
      itemNameDetail: "Debit",
      unit: "4",
      quantity: "600kg",
      description: "---",
      attachment: "📎",
      updates: "Receive"
    },
    {
      sNo: "04",
      itemName: selectedEntry.type || "faulty",
      itemCategory: "Materials",
      itemNameDetail: "Debit",
      unit: "7",
      quantity: "8kg",
      description: "---",
      attachment: "📎",
      updates: "Receive"
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/security/gate-pass/inwards')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inward List
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Gate Pass Inward Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Employee/Visitor Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Profile Section */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-yellow-600 font-bold text-xl">S</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{selectedEntry.personName}</h2>
              <p className="text-sm text-gray-600">{selectedEntry.category}</p>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee/Visitor Name:
                </label>
                <p className="text-sm text-gray-900">{selectedEntry.personName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visitor Mobile No.:
                </label>
                <p className="text-sm text-gray-900">086907860</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department:
                </label>
                <p className="text-sm text-gray-900">UI/UX Designer</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name:
                </label>
                <p className="text-sm text-gray-900">Lovated</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date/Time:
                </label>
                <p className="text-sm text-gray-900">2 July 2025 12:45 Pm</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mode Of Transport:
                </label>
                <p className="text-sm text-gray-900">{selectedEntry.modeOfTransport || "By Hand"}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Date:
                </label>
                <p className="text-sm text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Items Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">S No.</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item name</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item category</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item name</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unit</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Attachment</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Updates</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsData.map((item, index) => (
                  <TableRow key={item.sNo} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.sNo}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.itemName}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.itemCategory}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.itemNameDetail}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.unit}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.quantity}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.description}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">{item.attachment}</TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {item.updates}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};