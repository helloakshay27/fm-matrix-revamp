import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Eye,
  Filter,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Settings,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data for training
const mockTrainings = [
  {
    id: "TRN001",
    title: "Fire Safety Training",
    type: "Safety",
    status: "Completed",
    instructor: "John Safety",
    scheduledDate: "2024-01-15",
    duration: "4 hours",
    attendees: 25,
    maxCapacity: 30,
    location: "Training Room A",
    completionRate: 96,
  },
  {
    id: "TRN002",
    title: "First Aid Certification",
    type: "Medical",
    status: "Scheduled",
    instructor: "Dr. Sarah Medical",
    scheduledDate: "2024-01-20",
    duration: "8 hours",
    attendees: 15,
    maxCapacity: 20,
    location: "Conference Room B",
    completionRate: 0,
  },
  {
    id: "TRN003",
    title: "Equipment Safety Training",
    type: "Equipment",
    status: "In Progress",
    instructor: "Mike Equipment",
    scheduledDate: "2024-01-18",
    duration: "6 hours",
    attendees: 20,
    maxCapacity: 25,
    location: "Workshop Area",
    completionRate: 45,
  },
];

const calculateStats = (trainings: any[]) => {
  return {
    total: trainings.length,
    completed: trainings.filter(t => t.status === "Completed").length,
    scheduled: trainings.filter(t => t.status === "Scheduled").length,
    inProgress: trainings.filter(t => t.status === "In Progress").length,
    cancelled: trainings.filter(t => t.status === "Cancelled").length,
    totalAttendees: trainings.reduce((sum, t) => sum + t.attendees, 0),
    avgCompletionRate: trainings.reduce((sum, t) => sum + t.completionRate, 0) / trainings.length,
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed": return "bg-green-100 text-green-800";
    case "Scheduled": return "bg-blue-100 text-blue-800";
    case "In Progress": return "bg-yellow-100 text-yellow-800";
    case "Cancelled": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const TrainingListDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const stats = calculateStats(mockTrainings);
  const filteredTrainings = mockTrainings.filter(training =>
    training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTraining = () => {
    navigate("/safety/training-list/add");
  };

  const handleViewTraining = (trainingId: string) => {
    navigate(`/safety/training-list/details/${trainingId}`);
  };

  const StatCard = ({ icon, label, value }: any) => (
    <div className="bg-[#f6f4ee] p-6 rounded-lg shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4">
      <div className="w-14 h-14 bg-[#FBEDEC] rounded-full flex items-center justify-center">
        {React.cloneElement(icon, { className: `w-6 h-6 text-[#C72030]` })}
      </div>
      <div>
        <div className="text-2xl font-bold text-[#C72030]">{value}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="list"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <BookOpen className="w-4 h-4" />
            List
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <Settings className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
            <StatCard icon={<BookOpen />} label="Total Trainings" value={stats.total} />
            <StatCard icon={<CheckCircle />} label="Completed" value={stats.completed} />
            <StatCard icon={<Clock />} label="Scheduled" value={stats.scheduled} />
            <StatCard icon={<XCircle />} label="In Progress" value={stats.inProgress} />
            <StatCard icon={<BookOpen />} label="Total Attendees" value={stats.totalAttendees} />
            <StatCard icon={<CheckCircle />} label="Avg Completion Rate" value={`${stats.avgCompletionRate.toFixed(1)}%`} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddTraining}
                className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Schedule Training
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search trainings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Training ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Completion Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainings.map((training) => (
                  <TableRow key={training.id}>
                    <TableCell className="font-medium">{training.id}</TableCell>
                    <TableCell>{training.title}</TableCell>
                    <TableCell>{training.type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(training.status)}>
                        {training.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{training.instructor}</TableCell>
                    <TableCell>{training.scheduledDate}</TableCell>
                    <TableCell>{training.duration}</TableCell>
                    <TableCell>{training.attendees}/{training.maxCapacity}</TableCell>
                    <TableCell>{training.completionRate}%</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTraining(training.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Training Status Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Completed: {stats.completed}</span>
                  <span>{((stats.completed / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Scheduled: {stats.scheduled}</span>
                  <span>{((stats.scheduled / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>In Progress: {stats.inProgress}</span>
                  <span>{((stats.inProgress / stats.total) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Training Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Attendees: {stats.totalAttendees}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Completion Rate: {stats.avgCompletionRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Sessions: {stats.total}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};