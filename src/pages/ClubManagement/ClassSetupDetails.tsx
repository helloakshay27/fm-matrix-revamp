import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Users,
  Timer,
  MapPin,
  UserCheck,
  ClipboardList,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import {
  addTrainerToClass,
  deleteClass,
  getClassById,
  removeTrainerFromClass,
} from "./classSetupMockData";

const trainerColumns: ColumnConfig[] = [
  { key: "trainerName", label: "Trainer Name", sortable: true, hideable: true, draggable: true },
  { key: "specialization", label: "Specialization", sortable: true, hideable: true, draggable: true },
  { key: "experience", label: "Experience", sortable: true, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
  { key: "actions", label: "Actions", sortable: false, hideable: false, draggable: false },
];

const getStatusBadge = (status: string) => (
  <span
    className={
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " +
      (status === "Active" ? "bg-[#C7EDDA] text-gray-800" : "bg-[#F2C8C4] text-gray-800")
    }
  >
    {status}
  </span>
);

export const ClassSetupDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [, forceRefresh] = useState(0);
  const cls = id ? getClassById(id) : undefined;

  const [addTrainerOpen, setAddTrainerOpen] = useState(false);
  const [trainerForm, setTrainerForm] = useState({ name: "", email: "", specialization: "", experience: "" });

  if (!cls) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Class not found.</p>
        <Button variant="link" onClick={() => navigate("/club-management/class-setup")}>
          Back to Class Setup
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteClass(cls.id);
    toast.success("Class deleted successfully!");
    navigate("/club-management/class-setup");
  };

  const handleAddTrainer = () => {
    if (!trainerForm.name.trim()) {
      toast.error("Trainer name is required");
      return;
    }
    addTrainerToClass(cls.id, { ...trainerForm, status: "Active" });
    toast.success("Trainer added successfully!");
    setTrainerForm({ name: "", email: "", specialization: "", experience: "" });
    setAddTrainerOpen(false);
    forceRefresh((n) => n + 1);
  };

  const handleRemoveTrainer = (trainerId: string) => {
    removeTrainerFromClass(cls.id, trainerId);
    forceRefresh((n) => n + 1);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <button
              type="button"
              onClick={() => navigate("/club-management/class-setup")}
              className="flex items-center gap-2 text-black font-medium mb-2"
            >
              <ArrowLeft className="h-4 w-4 text-black" />
              Back to Class Setup List
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {cls.className}
              {getStatusBadge(cls.status)}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(`/club-management/class-setup/edit/${cls.id}`)}
              className="gap-2 fm-button-fix fm-button-brand"
            >
              <Pencil className="h-4 w-4" />
              Edit Class
            </Button>
          </div>
        </div>

        <Card className="border-gray-200 rounded-lg overflow-hidden shadow-none">
          <CardHeader className="bg-[#F6F4EE] border-b border-gray-200 flex-row items-center gap-3 space-y-0 p-4">
            <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030] shrink-0">
              <ClipboardList className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">Class Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoCard icon={<Users className="w-4 h-4" />} label="Max Capacity" value={`${cls.maxCapacity} Participants`} />
              <InfoCard icon={<UserCheck className="w-4 h-4" />} label="Min Participants" value={`${cls.minParticipants} Participants`} />
              <InfoCard icon={<Timer className="w-4 h-4" />} label="Duration" value={cls.duration || "-"} />
              <InfoCard icon={<MapPin className="w-4 h-4" />} label="Location" value={cls.location} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Class Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{cls.description || "No description provided."}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 rounded-lg overflow-hidden shadow-none">
          <CardHeader className="bg-[#F6F4EE] border-b border-gray-200 flex-row items-center justify-between gap-3 space-y-0 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030] shrink-0">
                <GraduationCap className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-800">Assigned Trainers</CardTitle>
            </div>
            <Button
              size="sm"
              className="fm-button-fix fm-button-brand"
              onClick={() => setAddTrainerOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Trainer
            </Button>
          </CardHeader>
          <CardContent className="p-4 bg-white">
            <EnhancedTaskTable
              data={cls.trainers}
              columns={trainerColumns}
              storageKey="class-setup-trainers-v1"
              hideTableExport={true}
              hideTableSearch={true}
              emptyMessage="No trainers assigned yet"
              renderRow={(trainer) => ({
                trainerName: (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#F2EEE9] flex items-center justify-center text-xs font-medium text-gray-600">
                      {trainer.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{trainer.name}</div>
                      <div className="text-xs text-gray-500">{trainer.email}</div>
                    </div>
                  </div>
                ),
                specialization: <span className="text-sm text-gray-700">{trainer.specialization}</span>,
                experience: <span className="text-sm text-gray-700">{trainer.experience}</span>,
                status: getStatusBadge(trainer.status),
                actions: (
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" title="Edit">
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      title="Remove"
                      onClick={() => handleRemoveTrainer(trainer.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ),
              })}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={addTrainerOpen} onOpenChange={setAddTrainerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Trainer</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Name</label>
              <Input value={trainerForm.name} onChange={(e) => setTrainerForm((f) => ({ ...f, name: e.target.value }))} placeholder="Trainer name" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email</label>
              <Input value={trainerForm.email} onChange={(e) => setTrainerForm((f) => ({ ...f, email: e.target.value }))} placeholder="trainer@recess.club" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Specialization</label>
              <Input value={trainerForm.specialization} onChange={(e) => setTrainerForm((f) => ({ ...f, specialization: e.target.value }))} placeholder="e.g. Pilates, Yoga" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Experience</label>
              <Input value={trainerForm.experience} onChange={(e) => setTrainerForm((f) => ({ ...f, experience: e.target.value }))} placeholder="e.g. 4 years" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setAddTrainerOpen(false)}>
              Cancel
            </Button>
            <Button className="fm-button-fix fm-button-brand" onClick={handleAddTrainer}>
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="border border-gray-200 rounded-md p-4 flex items-start gap-3">
    <div className="w-8 h-8 rounded-md bg-[#F6F4EE] text-brand flex items-center justify-center shrink-0">{icon}</div>
    <div>
      <div className="text-[10px] uppercase tracking-wide text-gray-400">{label}</div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  </div>
);

export default ClassSetupDetails;
