
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddEventModal } from "@/components/AddEventModal";
import { EventsFilterModal } from "@/components/EventsFilterModal";

const EventsDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Sample events data matching the reference image
  const events = [
    {
      id: 1,
      title: "Diwali Celebration",
      unit: "",
      createdBy: "",
      startDate: "13/06/2025 1:45 PM",
      endDate: "16/06/2025 3:00 AM",
      eventType: "General",
      status: "Published",
      expired: false,
      attachments: "",
      createdOn: "11/06/2025"
    },
    {
      id: 2,
      title: "test",
      unit: "",
      createdBy: "Ankit Gupta",
      startDate: "27/06/2025 12:15 PM",
      endDate: "28/06/2025 12:00 PM",
      eventType: "General",
      status: "Published",
      expired: false,
      attachments: "",
      createdOn: "11/06/2025"
    },
    {
      id: 3,
      title: "Diwali Celebration",
      unit: "",
      createdBy: "",
      startDate: "12/06/2025 11:45 AM",
      endDate: "14/06/2025 3:00 AM",
      eventType: "General",
      status: "Published",
      expired: false,
      attachments: "",
      createdOn: "11/06/2025"
    },
    {
      id: 4,
      title: "New Test",
      unit: "",
      createdBy: "Atharv Karnekar",
      startDate: "30/05/2025 5:00 PM",
      endDate: "31/05/2025 5:01 AM",
      eventType: "Personal",
      status: "Published",
      expired: true,
      attachments: "",
      createdOn: "29/05/2025"
    },
    {
      id: 5,
      title: "aks",
      unit: "",
      createdBy: "Ankit Gupta",
      startDate: "22/05/2025 4:54 PM",
      endDate: "29/05/2025 6:56 PM",
      eventType: "Personal",
      status: "Published",
      expired: true,
      attachments: "",
      createdOn: "10/05/2025"
    }
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600">
          Events &gt; Event List
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">EVENT LIST</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-purple-700 hover:bg-purple-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsFilterModalOpen(true)}
              className="border-gray-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>View</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Created by</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expired</TableHead>
                <TableHead>Attachments</TableHead>
                <TableHead>Created On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="w-4 h-4 border border-gray-400 rounded-sm cursor-pointer"></div>
                  </TableCell>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{event.unit}</TableCell>
                  <TableCell>{event.createdBy}</TableCell>
                  <TableCell>{event.startDate}</TableCell>
                  <TableCell>{event.endDate}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={event.eventType === "General" ? "default" : "secondary"}
                      className={event.eventType === "General" ? "bg-green-600 text-white" : "bg-blue-600 text-white"}
                    >
                      {event.eventType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-600 text-white">
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {event.expired && (
                      <Badge className="bg-red-600 text-white">
                        Expired
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{event.attachments}</TableCell>
                  <TableCell>{event.createdOn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddEventModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
      
      <EventsFilterModal 
        open={isFilterModalOpen} 
        onOpenChange={setIsFilterModalOpen} 
      />
    </div>
  );
};

export default EventsDashboard;
