import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Filter } from "lucide-react";
import { API_CONFIG } from "@/config/apiConfig";
import { CheckpointFilters, EMPTY_CP_FILTERS } from "@/types/checkpointFilters";

// ── Types ────────────────────────────────────────────────────────────────────
interface LocationOption {
  id: number;
  name: string;
}

interface CheckpointFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: CheckpointFilters) => void;
  currentFilters: CheckpointFilters;
}

// ── Fetch helper ─────────────────────────────────────────────────────────────
const fetchJson = async (url: string): Promise<unknown> => {
  const token = API_CONFIG.TOKEN;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const extractList = (data: unknown, key: string): LocationOption[] => {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj[key])) return obj[key] as LocationOption[];
    if (Array.isArray(obj["data"])) return obj["data"] as LocationOption[];
  }
  if (Array.isArray(data)) return data as LocationOption[];
  return [];
};

// ── Component ────────────────────────────────────────────────────────────────
export const CheckpointFilterDialog: React.FC<CheckpointFilterDialogProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}) => {
  // Form IDs
  const [siteId, setSiteId] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [wingId, setWingId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [floorId, setFloorId] = useState("");
  const [roomId, setRoomId] = useState("");

  // Dropdown data
  const [sites, setSites] = useState<LocationOption[]>([]);
  const [buildings, setBuildings] = useState<LocationOption[]>([]);
  const [wings, setWings] = useState<LocationOption[]>([]);
  const [areas, setAreas] = useState<LocationOption[]>([]);
  const [floors, setFloors] = useState<LocationOption[]>([]);
  const [rooms, setRooms] = useState<LocationOption[]>([]);

  // Loading flags
  const [loadingSites, setLoadingSites] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const BASE = API_CONFIG.BASE_URL;

  // ── Sync local state with incoming currentFilters ─────────────────────────
  useEffect(() => {
    if (isOpen) {
      setSiteId(currentFilters.siteId);
      setBuildingId(currentFilters.buildingId);
      setWingId(currentFilters.wingId);
      setAreaId(currentFilters.areaId);
      setFloorId(currentFilters.floorId);
      setRoomId(currentFilters.roomId);
    }
  }, [isOpen, currentFilters]);

  // ── Fetch sites on open ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    setLoadingSites(true);
    fetchJson(`${BASE}/pms/sites.json`)
      .then((d) => setSites(extractList(d, "sites")))
      .catch(() => setSites([]))
      .finally(() => setLoadingSites(false));
  }, [isOpen, BASE]);

  // ── Independent fetch functions ───────────────────────────────────────────
  // Buildings: scoped to site if a site is selected, else all
  const refetchBuildings = useCallback(
    (sid: string) => {
      setLoadingBuildings(true);
      const url = sid
        ? `${BASE}/pms/sites/${sid}/buildings.json`
        : `${BASE}/pms/buildings.json`;
      fetchJson(url)
        .then((d) => setBuildings(extractList(d, "buildings")))
        .catch(() => setBuildings([]))
        .finally(() => setLoadingBuildings(false));
    },
    [BASE]
  );

  // Wings: filtered by buildingId if available
  const refetchWings = useCallback(
    (bid: string) => {
      setLoadingWings(true);
      const params = new URLSearchParams();
      if (bid) params.set("q[building_id_eq]", bid);
      fetchJson(`${BASE}/pms/wings.json?${params.toString()}`)
        .then((d) => setWings(extractList(d, "wings")))
        .catch(() => setWings([]))
        .finally(() => setLoadingWings(false));
    },
    [BASE]
  );

  // Areas: filtered by wingId and/or buildingId if available
  const refetchAreas = useCallback(
    (wid: string, bid: string) => {
      setLoadingAreas(true);
      const params = new URLSearchParams();
      if (wid) params.set("q[wing_id_eq]", wid);
      if (bid) params.set("q[building_id_eq]", bid);
      fetchJson(`${BASE}/pms/areas.json?${params.toString()}`)
        .then((d) => setAreas(extractList(d, "areas")))
        .catch(() => setAreas([]))
        .finally(() => setLoadingAreas(false));
    },
    [BASE]
  );

  // Floors: filtered by areaId, buildingId, wingId if available
  const refetchFloors = useCallback(
    (aid: string, bid: string, wid: string) => {
      setLoadingFloors(true);
      const params = new URLSearchParams();
      if (aid) params.set("q[area_id_eq]", aid);
      if (bid) params.set("q[building_id_eq]", bid);
      if (wid) params.set("q[wing_id_eq]", wid);
      fetchJson(`${BASE}/pms/floors.json?${params.toString()}`)
        .then((d) => setFloors(extractList(d, "floors")))
        .catch(() => setFloors([]))
        .finally(() => setLoadingFloors(false));
    },
    [BASE]
  );

  // Rooms: filtered by floorId, buildingId, wingId, areaId if available
  const refetchRooms = useCallback(
    (fid: string, bid: string, wid: string, aid: string) => {
      setLoadingRooms(true);
      const params = new URLSearchParams();
      if (fid) params.set("q[floor_id_eq]", fid);
      if (bid) params.set("q[building_id_eq]", bid);
      if (wid) params.set("q[wing_id_eq]", wid);
      if (aid) params.set("q[area_id_eq]", aid);
      fetchJson(`${BASE}/pms/rooms.json?${params.toString()}`)
        .then((d) => setRooms(extractList(d, "rooms")))
        .catch(() => setRooms([]))
        .finally(() => setLoadingRooms(false));
    },
    [BASE]
  );

  // Pre-load all dropdowns when dialog opens (with whatever current filter IDs exist)
  useEffect(() => {
    if (!isOpen) return;
    refetchBuildings(currentFilters.siteId);
    refetchWings(currentFilters.buildingId);
    refetchAreas(currentFilters.wingId, currentFilters.buildingId);
    refetchFloors(currentFilters.areaId, currentFilters.buildingId, currentFilters.wingId);
    refetchRooms(currentFilters.floorId, currentFilters.buildingId, currentFilters.wingId, currentFilters.areaId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const findName = (list: LocationOption[], id: string) =>
    list.find((l) => l.id.toString() === id)?.name || "";

  const clean = (v: string) => (v === "__clear__" ? "" : v);

  // ── Independent change handlers (no cascade clears) ───────────────────────
  const handleSiteChange = (val: string) => {
    const id = clean(val);
    setSiteId(id);
    // Re-fetch buildings scoped to this site; other fields remain untouched
    refetchBuildings(id);
  };

  const handleBuildingChange = (val: string) => {
    const id = clean(val);
    setBuildingId(id);
    // Re-fetch wings/areas/floors/rooms scoped to the new building
    refetchWings(id);
    refetchAreas(wingId, id);
    refetchFloors(areaId, id, wingId);
    refetchRooms(floorId, id, wingId, areaId);
  };

  const handleWingChange = (val: string) => {
    const id = clean(val);
    setWingId(id);
    refetchAreas(id, buildingId);
    refetchFloors(areaId, buildingId, id);
    refetchRooms(floorId, buildingId, id, areaId);
  };

  const handleAreaChange = (val: string) => {
    const id = clean(val);
    setAreaId(id);
    refetchFloors(id, buildingId, wingId);
    refetchRooms(floorId, buildingId, wingId, id);
  };

  const handleFloorChange = (val: string) => {
    const id = clean(val);
    setFloorId(id);
    refetchRooms(id, buildingId, wingId, areaId);
  };

  // ── Apply ─────────────────────────────────────────────────────────────────
  const handleApply = () => {
    onApply({
      siteId,
      buildingId,
      wingId,
      areaId,
      floorId,
      roomId,
      siteName: findName(sites, siteId),
      buildingName: findName(buildings, buildingId),
      wingName: findName(wings, wingId),
      areaName: findName(areas, areaId),
      floorName: findName(floors, floorId),
      roomName: findName(rooms, roomId),
    });
    onClose();
  };

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setSiteId("");
    setBuildingId("");
    setWingId("");
    setAreaId("");
    setFloorId("");
    setRoomId("");
    onApply(EMPTY_CP_FILTERS);
    onClose();
  };

  const hasAnyFilter = !!(siteId || buildingId || wingId || areaId || floorId || roomId);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#C72030]" />
            Filter Checkpoints
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Location Details */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Location Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Site */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Site</Label>
                <Select
                  value={siteId}
                  onValueChange={handleSiteChange}
                  disabled={loadingSites}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={loadingSites ? "Loading..." : "Select Site"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__clear__">All Sites</SelectItem>
                    {sites.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Building */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Building</Label>
                <Select
                  value={buildingId}
                  onValueChange={handleBuildingChange}
                  disabled={loadingBuildings}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={loadingBuildings ? "Loading..." : "Select Building"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__clear__">All Buildings</SelectItem>
                    {buildings.map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Wing */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Wing</Label>
                <Select
                  value={wingId}
                  onValueChange={handleWingChange}
                  disabled={loadingWings}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={loadingWings ? "Loading..." : "Select Wing"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__clear__">All Wings</SelectItem>
                    {wings.map((w) => (
                      <SelectItem key={w.id} value={w.id.toString()}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Area */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Area</Label>
                <Select
                  value={areaId}
                  onValueChange={handleAreaChange}
                  disabled={loadingAreas}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={loadingAreas ? "Loading..." : "Select Area"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__clear__">All Areas</SelectItem>
                    {areas.map((a) => (
                      <SelectItem key={a.id} value={a.id.toString()}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Floor */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Floor</Label>
                <Select
                  value={floorId}
                  onValueChange={handleFloorChange}
                  disabled={loadingFloors}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={loadingFloors ? "Loading..." : "Select Floor"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__clear__">All Floors</SelectItem>
                    {floors.map((f) => (
                      <SelectItem key={f.id} value={f.id.toString()}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Room */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Room</Label>
                <Select
                  value={roomId}
                  onValueChange={(val) => setRoomId(clean(val))}
                  disabled={loadingRooms}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={loadingRooms ? "Loading..." : "Select Room"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__clear__">All Rooms</SelectItem>
                    {rooms.map((r) => (
                      <SelectItem key={r.id} value={r.id.toString()}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasAnyFilter}
            className="text-sm"
          >
            Clear All
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose} className="text-sm">
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="text-sm bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
