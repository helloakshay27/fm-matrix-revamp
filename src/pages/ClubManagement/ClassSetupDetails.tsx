import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
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
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
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
import { useClubManagementEvents } from "@/components/PostHogClubManagementEvents";

interface TrainerOption {
  id: string;
  name: string;
}

interface ClassDetail {
  id: string;
  className: string;
  classType: string;
  activityType: string;
  maxCapacity: number;
  minParticipants: number;
  durationMinutes: number;
  location: string;
  status: "Active" | "Inactive";
  trainerIds: string[];
}

const titleCase = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "");

const trainerColumns: ColumnConfig[] = [
  { key: "trainerName", label: "Trainer Name", sortable: true, hideable: true, draggable: true },
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
  const cmEvents = useClubManagementEvents();
  const detailViewLogged = useRef(false);

  const [cls, setCls] = useState<ClassDetail | null>(null);
  const [trainerDirectory, setTrainerDirectory] = useState<TrainerOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [addTrainerOpen, setAddTrainerOpen] = useState(false);
  const [selectedNewTrainer, setSelectedNewTrainer] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [classRes, trainerRes] = await Promise.all([
          axios.get(`https://${baseUrl}/pms/admin/club_classes/${id}.json`, { headers }),
          axios.get(`https://${baseUrl}/pms/admin/club_classes/trainer_list.json`, { headers }),
        ]);

        const c = classRes.data?.club_class ?? classRes.data;
        setCls({
          id: String(c.id),
          className: c.name ?? "",
          classType: titleCase(c.session_type),
          activityType: titleCase(c.activity_type),
          maxCapacity: c.max_capacity ?? 0,
          minParticipants: c.min_capacity ?? 0,
          durationMinutes: c.duration_minutes ?? 0,
          location: c.location ?? "",
          status: String(c.status).toLowerCase() === "active" ? "Active" : "Inactive",
          trainerIds: (c.trainer_ids ?? []).map(String),
        });

        const trainerData = trainerRes.data;
        const list = Array.isArray(trainerData)
          ? trainerData
          : trainerData?.trainers ?? trainerData?.data ?? [];
        setTrainerDirectory(
          list.map((t: any) => ({
            id: String(t.id),
            name: t.name ?? t.full_name ?? `Trainer ${t.id}`,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch class details", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  useEffect(() => {
    if (detailViewLogged.current) return;
    detailViewLogged.current = true;
    cmEvents.detailViewed("Class Setup", id, "class_setup_details");
  }, [cmEvents, id]);

  const persistTrainerIds = async (nextTrainerIds: string[]) => {
    if (!cls) return false;
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const url = `https://${baseUrl}/pms/admin/club_classes/${cls.id}.json`;
      await axios.put(
        url,
        {
          club_class: {
            name: cls.className,
            session_type: cls.classType.toLowerCase(),
            activity_type: cls.activityType.toLowerCase(),
            max_capacity: cls.maxCapacity,
            min_capacity: cls.minParticipants,
            duration_minutes: cls.durationMinutes,
            location: cls.location,
            status: cls.status.toLowerCase(),
            bundle_eligible: true,
            trainer_ids: nextTrainerIds,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCls((prev) => (prev ? { ...prev, trainerIds: nextTrainerIds } : prev));
      return true;
    } catch (err) {
      toast.error("Failed to update assigned trainers");
      return false;
    }
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (notFound || !cls) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Class not found.</p>
        <Button variant="link" onClick={() => navigate("/club-management/class-setup")}>
          Back to Class Setup
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      await axios.delete(`https://${baseUrl}/pms/admin/club_classes/${cls.id}.json`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cmEvents.deleted("Class Setup", cls.id, "class_setup_details");
      toast.success("Class deleted successfully!");
      navigate("/club-management/class-setup");
    } catch (err) {
      toast.error("Failed to delete class");
    }
  };

  const handleAddTrainer = async () => {
    if (!selectedNewTrainer) {
      toast.error("Select a trainer to add");
      return;
    }
    const ok = await persistTrainerIds([...cls.trainerIds, selectedNewTrainer]);
    if (ok) {
      cmEvents.action("Class Setup Trainer Added", { entity_id: cls.id });
      toast.success("Trainer added successfully!");
      setSelectedNewTrainer("");
      setAddTrainerOpen(false);
    }
  };

  const handleRemoveTrainer = async (trainerId: string) => {
    const ok = await persistTrainerIds(cls.trainerIds.filter((tid) => tid !== trainerId));
    if (ok) {
      cmEvents.action("Class Setup Trainer Removed", { entity_id: cls.id, trainer_id: trainerId });
      toast.success("Trainer removed");
    }
  };

  const assignedTrainers = cls.trainerIds.map((tid) => ({
    id: tid,
    name: trainerDirectory.find((t) => t.id === tid)?.name ?? `Trainer ${tid}`,
  }));
  const availableTrainers = trainerDirectory.filter((t) => !cls.trainerIds.includes(t.id));

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
              <InfoCard icon={<ClipboardList className="w-4 h-4" />} label="Class Type" value={cls.classType || "-"} />
              <InfoCard icon={<ClipboardList className="w-4 h-4" />} label="Activity Type" value={cls.activityType || "-"} />
              <InfoCard icon={<Users className="w-4 h-4" />} label="Max Capacity" value={`${cls.maxCapacity} Participants`} />
              <InfoCard icon={<UserCheck className="w-4 h-4" />} label="Min Participants" value={`${cls.minParticipants} Participants`} />
              <InfoCard icon={<Timer className="w-4 h-4" />} label="Duration" value={`${cls.durationMinutes} min`} />
              <InfoCard icon={<MapPin className="w-4 h-4" />} label="Location" value={cls.location || "-"} />
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
              data={assignedTrainers}
              columns={trainerColumns}
              storageKey="class-setup-trainers-v1"
              hideTableExport={true}
              hideTableSearch={true}
              emptyMessage="No trainers assigned yet"
              renderRow={(trainer: { id: string; name: string }) => ({
                trainerName: (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#F2EEE9] flex items-center justify-center text-xs font-medium text-gray-600">
                      {trainer.name.slice(0, 1)}
                    </div>
                    <div className="font-medium text-gray-900">{trainer.name}</div>
                  </div>
                ),
                actions: (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    title="Remove"
                    onClick={() => handleRemoveTrainer(trainer.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
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
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Trainer</InputLabel>
            <MuiSelect
              value={selectedNewTrainer}
              onChange={(e) => setSelectedNewTrainer(e.target.value)}
              label="Trainer"
              notched
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select trainer...
              </MenuItem>
              {availableTrainers.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
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
