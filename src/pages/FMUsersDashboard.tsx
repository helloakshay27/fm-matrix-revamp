
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter, Copy, Eye } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const FMUsersDashboard = () => {
  const fmUsers = [
    { id: 212923, userName: "yyuiyiy iujo", gender: "Male", mobile: "7897780978", email: "tesruhhi@gmail.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Pending", faceRecognition: "No", appDownloaded: "No" },
    { id: 212919, userName: "sameer kumar", gender: "", mobile: "2134513211", email: "2134513211@gmail.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Soft Skill Personnel", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "No" },
    { id: 212384, userName: "ABHIDNYA TAPAL", gender: "Female", mobile: "7208523035", email: "abhidnyatapal@gmail.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "Yes" },
    { id: 195169, userName: "Dhananjay Bhoyar", gender: "Male", mobile: "9022281139", email: "dhananjay.bhoyar@lockated.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "No" },
    { id: 193551, userName: "Ravi Sampat", gender: "", mobile: "9653473232", email: "ravi.sampat@lockated.com", unit: "Function 1", department: "", employeeId: "", accessLevel: "Company", type: "Admin", role: "Vinayak Test Role", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "Yes" },
    { id: 193550, userName: "Jyoti Dubey", gender: "", mobile: "8108245903", email: "jyotidubey.tiwari@lockated.com", unit: "Function 3", department: "", employeeId: "", accessLevel: "Company", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "Yes" },
    { id: 192335, userName: "Pratik Bobade", gender: "Male", mobile: "8805056392", email: "pratik.bobade@lockated.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "No", status: "Approved", faceRecognition: "No", appDownloaded: "No" },
    { id: 190844, userName: "Sadanand Gupta", gender: "Male", mobile: "9769884879", email: "sadanand.gupta@lockated.com", unit: "", department: "", employeeId: "", accessLevel: "Country", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "No" },
    { id: 182388, userName: "Komal Shinde", gender: "Female", mobile: "8669112232", email: "komal.shinde@lockated.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "Yes" },
    { id: 182347, userName: "Sony Bhosle", gender: "F", mobile: "9607574091", email: "sony.bhosle@lockated.com", unit: "Function 3", department: "", employeeId: "", accessLevel: "Company", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "Yes", appDownloaded: "Yes" },
    { id: 156462, userName: "Ajay Pirhulkar", gender: "", mobile: "7709672441", email: "ajay.pirhulkar@gophygital.work", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "No" },
    { id: 156461, userName: "Priya Mane", gender: "", mobile: "9821229952", email: "priya@lockated.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "No" },
    { id: 156459, userName: "Omkar Chavan", gender: "", mobile: "9767112823", email: "omkar.chavan@lockated.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "No" },
    { id: 155066, userName: "Ankit Gupta", gender: "Male", mobile: "7389997281", email: "ankit.gupta@lockated.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "Yes" },
    { id: 153908, userName: "Fardeen Shaikh", gender: "Male", mobile: "8686342003", email: "fardeen.shaikh@lockated.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "No" },
    { id: 148770, userName: "Adhip Shetty", gender: "Male", mobile: "9673565064", email: "adhip.shetty@lockated.com", unit: "Operations", department: "", employeeId: "", accessLevel: "Company", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "Yes" },
    { id: 148769, userName: "Sanjay Santhanamahalingam", gender: "Male", mobile: "7506522558", email: "sanjay.s@gophygital.work", unit: "Marketing", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "Yes", appDownloaded: "Yes" },
    { id: 147287, userName: "Aishwarya Galgale", gender: "Female", mobile: "8788189482", email: "aishwarya.galgale@lockated.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "Yes", appDownloaded: "Yes" },
  ];

  const getStatusBadge = (status: string) => {
    const variant = status === "Approved" ? "default" : "secondary";
    const color = status === "Approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
    return (
      <Badge variant={variant} className={color}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-2">
        FM &gt; FM User List
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">FM USER LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
        <Button className="bg-[#8B4B8B] hover:bg-[#7A3F7A] text-white flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
        <Button className="bg-[#8B4B8B] hover:bg-[#7A3F7A] text-white flex items-center gap-2">
          <Copy className="w-4 h-4" />
          Clone/Transfer
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-center font-medium">Action</TableHead>
              <TableHead className="text-center font-medium">ID</TableHead>
              <TableHead className="text-center font-medium">User Name</TableHead>
              <TableHead className="text-center font-medium">Gender</TableHead>
              <TableHead className="text-center font-medium">Mobile Number</TableHead>
              <TableHead className="text-center font-medium">Email</TableHead>
              <TableHead className="text-center font-medium">Unit</TableHead>
              <TableHead className="text-center font-medium">Department</TableHead>
              <TableHead className="text-center font-medium">Employee ID</TableHead>
              <TableHead className="text-center font-medium">Access Level</TableHead>
              <TableHead className="text-center font-medium">Type</TableHead>
              <TableHead className="text-center font-medium">Role</TableHead>
              <TableHead className="text-center font-medium">Active</TableHead>
              <TableHead className="text-center font-medium">Status</TableHead>
              <TableHead className="text-center font-medium">Face Recognition</TableHead>
              <TableHead className="text-center font-medium">App Downloaded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fmUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell className="text-center">
                  <Eye className="w-4 h-4 text-gray-600 mx-auto cursor-pointer hover:text-gray-800" />
                </TableCell>
                <TableCell className="text-center">{user.id}</TableCell>
                <TableCell className="text-center">{user.userName}</TableCell>
                <TableCell className="text-center">{user.gender}</TableCell>
                <TableCell className="text-center">{user.mobile}</TableCell>
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">{user.unit}</TableCell>
                <TableCell className="text-center">{user.department}</TableCell>
                <TableCell className="text-center">{user.employeeId}</TableCell>
                <TableCell className="text-center">{user.accessLevel}</TableCell>
                <TableCell className="text-center">{user.type}</TableCell>
                <TableCell className="text-center">{user.role}</TableCell>
                <TableCell className="text-center">{user.active}</TableCell>
                <TableCell className="text-center">{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-center">{user.faceRecognition}</TableCell>
                <TableCell className="text-center">{user.appDownloaded}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FMUsersDashboard;
