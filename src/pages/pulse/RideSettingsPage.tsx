import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Settings2,
  Save,
  X,
  MapPin,
  Clock,
  Calendar,
  Ban,
  Loader2,
} from "lucide-react";

interface RideSetting {
  id: number;
  name: string;
  label: string;
  value: string;
  unit: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const unitIcons: Record<string, React.ElementType> = {
  km: MapPin,
  minutes: Clock,
};

const RideSettingsPage = () => {
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [settings, setSettings] = useState<RideSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://${baseUrl}/ride_settings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSettings(response.data.ride_settings || []);
    } catch (error) {
      console.error("Failed to fetch ride settings", error);
      toast.error("Failed to load ride settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleEdit = (setting: RideSetting) => {
    setEditingId(setting.id);
    setEditValue(setting.value);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleSave = async (setting: RideSetting) => {
    if (!editValue.trim()) {
      toast.error("Value cannot be empty");
      return;
    }

    setSaving(true);
    try {
      await axios.put(
        `https://${baseUrl}/ride_settings/${setting.id}`,
        {
          ride_setting: {
            name: setting.name,
            value: editValue.trim(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(`${setting.label} updated successfully`);
      setEditingId(null);
      setEditValue("");
      await fetchSettings();
    } catch (error) {
      console.error("Failed to update ride setting", error);
      toast.error("Failed to update setting");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    setting: RideSetting
  ) => {
    if (e.key === "Enter") {
      handleSave(setting);
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-[#C72030]/10">
          <Settings2 className="w-6 h-6 text-[#C72030]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            Ride Settings
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure ride matching parameters and booking rules
          </p>
        </div>
      </div>

      {settings.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Settings2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">No ride settings found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {settings.map((setting) => {
            const Icon = unitIcons[setting.unit] || Settings2;
            const isEditing = editingId === setting.id;

            return (
              <div
                key={setting.id}
                className="bg-white rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-2.5 rounded-lg bg-gray-50 shrink-0">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1a1a1a]">
                        {setting.label}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {setting.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, setting)}
                            className="w-20 px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]/20 focus:border-[#C72030] text-right"
                            autoFocus
                          />
                          <span className="text-sm text-gray-400 min-w-[4rem]">
                            {setting.unit}
                          </span>
                        </div>
                        <button
                          onClick={() => handleSave(setting)}
                          disabled={saving}
                          className="p-1.5 rounded-lg bg-[#C72030] text-white hover:bg-[#a31b27] transition-colors disabled:opacity-50"
                          title="Save"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={saving}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-lg font-bold text-[#1a1a1a]">
                            {setting.value}
                          </span>
                          <span className="text-sm text-gray-400 ml-1">
                            {setting.unit}
                          </span>
                        </div>
                        <button
                          onClick={() => handleEdit(setting)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#C72030] hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Settings2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RideSettingsPage;
