
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";

export const MOMDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const momData = [
    {
      id: 1390,
      title: "Rustomjee App Testing",
      dateOfMeeting: "06/06/2025, 2:30 PM",
      tag: "",
      tasks: 11,
      raisedBy: "Kshitij Rasal",
      attendees: 6
    },
    {
      id: 1389,
      title: "Staff Management Training",
      dateOfMeeting: "05/06/2025, 12:00 PM",
      tag: "HiSociety",
      tasks: 1,
      raisedBy: "Deepak Gupta",
      attendees: 2
    },
    {
      id: 1387,
      title: "test",
      dateOfMeeting: "04/06/2025, 4:29 PM",
      tag: "",
      tasks: 1,
      raisedBy: "",
      attendees: 1
    },
    {
      id: 1376,
      title: "Technical Discussion : Customer App",
      dateOfMeeting: "08/04/2025, 2:00 PM",
      tag: "",
      tasks: 6,
      raisedBy: "Kshitij Rasal",
      attendees: 9
    },
    {
      id: 1375,
      title: "Lo-Fi Final Discussions",
      dateOfMeeting: "31/03/2025, 11:00 AM",
      tag: "",
      tasks: 27,
      raisedBy: "Kshitij Rasal",
      attendees: 6
    },
    {
      id: 1374,
      title: "Low Fidelity Flow Discussion",
      dateOfMeeting: "26/03/2025, 1:00 PM",
      tag: "",
      tasks: 9,
      raisedBy: "Kshitij Rasal",
      attendees: 6
    },
    {
      id: 1373,
      title: "Customer App : Low Fidelity Walkthrough",
      dateOfMeeting: "18/03/2025, 11:00 AM",
      tag: "",
      tasks: 23,
      raisedBy: "Kshitij Rasal",
      attendees: 14
    },
    {
      id: 1372,
      title: "Rustomjee Post Sales App Progress",
      dateOfMeeting: "18/03/2025, 2:30 PM",
      tag: "",
      tasks: 4,
      raisedBy: "Kshitij Rasal",
      attendees: 9
    },
    {
      id: 1370,
      title: "Customer App - Feature list discussion_Kalpataru",
      dateOfMeeting: "06/03/2025, 10:30 AM",
      tag: "",
      tasks: 23,
      raisedBy: "Kshitij Rasal",
      attendees: 11
    },
    {
      id: 1362,
      title: "Kalpataru Steering Committee Meeting 1",
      dateOfMeeting: "19/02/2025, 10:30 AM",
      tag: "",
      tasks: 15,
      raisedBy: "Kshitij Rasal",
      attendees: 12
    },
    {
      id: 1358,
      title: "Rustomjee Marketing Discussions as per APIs",
      dateOfMeeting: "07/02/2025, 11:15 AM",
      tag: "",
      tasks: 5,
      raisedBy: "Kshitij Rasal",
      attendees: 4
    }
  ];

  const filteredData = momData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.raisedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Mom &gt; Mom List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">MOM LIST</h1>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            ➕ Add
          </Button>
          <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
            🔍 Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Date of Meeting</TableHead>
              <TableHead className="font-semibold">Tag</TableHead>
              <TableHead className="font-semibold">Tasks</TableHead>
              <TableHead className="font-semibold">Raised By</TableHead>
              <TableHead className="font-semibold">Attendees</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600 cursor-pointer" />
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {item.id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.dateOfMeeting}</TableCell>
                <TableCell>
                  {item.tag && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                      {item.tag}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">{item.tasks}</TableCell>
                <TableCell>{item.raisedBy}</TableCell>
                <TableCell className="text-center">{item.attendees}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
