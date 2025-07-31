import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Filter } from 'lucide-react';

export interface MobileAssetFilters {
  assetName?: string;
  assetId?: string;
  groupId?: string;
  subgroupId?: string;
  siteId?: string;
  buildingId?: string;
  wingId?: string;
  areaId?: string;
  floorId?: string;
  roomId?: string;
  status?: string;
  breakdown?: boolean;
}

interface MobileAssetFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: MobileAssetFilters) => void;
  currentFilters: MobileAssetFilters;
}

interface GroupItem {
  id: number;
  name: string;
}

interface SubGroupItem {
  id: number;
  name: string;
  group_id: number;
}

interface SiteItem {
  id: number;
  name: string;
}

interface BuildingItem {
  id: number;
  name: string;
}

interface WingItem {
  id: number;
  name: string;
}

interface AreaItem {
  id: number;
  name: string;
}

interface FloorItem {
  id: number;
  name: string;
}

interface RoomItem {
  id: number;
  name: string;
}

export const MobileAssetFilterDialog: React.FC<MobileAssetFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters
}) => {
  // Form state
  const [assetName, setAssetName] = useState(currentFilters.assetName || '');
  const [assetId, setAssetId] = useState(currentFilters.assetId || '');
  const [group, setGroup] = useState(currentFilters.groupId || '');
  const [subgroup, setSubgroup] = useState(currentFilters.subgroupId || '');
  const [site, setSite] = useState(currentFilters.siteId || '');
  const [building, setBuilding] = useState(currentFilters.buildingId || '');
  const [wing, setWing] = useState(currentFilters.wingId || '');
  const [area, setArea] = useState(currentFilters.areaId || '');
  const [floor, setFloor] = useState(currentFilters.floorId || '');
  const [room, setRoom] = useState(currentFilters.roomId || '');
  const [status, setStatus] = useState(currentFilters.status || '');

  // API data states
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [subgroups, setSubgroups] = useState<SubGroupItem[]>([]);
  const [sites, setSites] = useState<SiteItem[]>([]);
  const [buildings, setBuildings] = useState<BuildingItem[]>([]);
  const [wings, setWings] = useState<WingItem[]>([]);
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [floors, setFloors] = useState<FloorItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);

  // Loading states
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingSubgroups, setLoadingSubgroups] = useState(false);
  const [loadingSites, setLoadingSites] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Fetch groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      if (!isOpen) return;
      
      setLoadingGroups(true);
      try {
        const mobileToken = sessionStorage.getItem("mobile_token");
        let baseUrl = sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";
        baseUrl = baseUrl.replace(/\/$/, "");
        if (!baseUrl.startsWith("http")) {
          baseUrl = `https://${baseUrl}`;
        }

        const response = await fetch(`${baseUrl}/pms/assets/get_asset_group_sub_group.json`, {
          headers: {
            'Authorization': `Bearer ${mobileToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const groupsData = Array.isArray(data?.asset_groups) ? data.asset_groups : [];
          setGroups(groupsData);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        setGroups([]);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchGroups();
  }, [isOpen]);

  // Fetch subgroups when group changes
  useEffect(() => {
    const fetchSubgroups = async () => {
      if (!group) {
        setSubgroups([]);
        return;
      }

      setLoadingSubgroups(true);
      try {
        const mobileToken = sessionStorage.getItem("mobile_token");
        let baseUrl = sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";
        baseUrl = baseUrl.replace(/\/$/, "");
        if (!baseUrl.startsWith("http")) {
          baseUrl = `https://${baseUrl}`;
        }

        const response = await fetch(`${baseUrl}/pms/assets/get_asset_group_sub_group.json?group_id=${group}`, {
          headers: {
            'Authorization': `Bearer ${mobileToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const subgroupsData = Array.isArray(data?.asset_groups) ? data.asset_groups : [];
          setSubgroups(subgroupsData);
        }
      } catch (error) {
        console.error('Error fetching subgroups:', error);
        setSubgroups([]);
      } finally {
        setLoadingSubgroups(false);
      }
    };

    fetchSubgroups();
  }, [group]);

  // Fetch sites on component mount
  useEffect(() => {
    const fetchSites = async () => {
      if (!isOpen) return;
      
      setLoadingSites(true);
      try {
        const mobileToken = sessionStorage.getItem("mobile_token");
        let baseUrl = sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";
        baseUrl = baseUrl.replace(/\/$/, "");
        if (!baseUrl.startsWith("http")) {
          baseUrl = `https://${baseUrl}`;
        }

        const response = await fetch(`${baseUrl}/pms/sites.json`, {
          headers: {
            'Authorization': `Bearer ${mobileToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const sitesData = Array.isArray(data?.sites) ? data.sites : [];
          setSites(sitesData);
        }
      } catch (error) {
        console.error('Error fetching sites:', error);
        setSites([]);
      } finally {
        setLoadingSites(false);
      }
    };

    fetchSites();
  }, [isOpen]);

  // Fetch buildings when site changes
  useEffect(() => {
    const fetchBuildings = async () => {
      if (!site) {
        setBuildings([]);
        return;
      }

      setLoadingBuildings(true);
      try {
        const mobileToken = sessionStorage.getItem("mobile_token");
        let baseUrl = sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";
        baseUrl = baseUrl.replace(/\/$/, "");
        if (!baseUrl.startsWith("http")) {
          baseUrl = `https://${baseUrl}`;
        }

        const response = await fetch(`${baseUrl}/pms/buildings.json?site_id=${site}`, {
          headers: {
            'Authorization': `Bearer ${mobileToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const buildingsData = Array.isArray(data?.buildings) ? data.buildings : [];
          setBuildings(buildingsData);
        }
      } catch (error) {
        console.error('Error fetching buildings:', error);
        setBuildings([]);
      } finally {
        setLoadingBuildings(false);
      }
    };

    fetchBuildings();
  }, [site]);

  // Fetch wings when building changes
  useEffect(() => {
    const fetchWings = async () => {
      if (!building) {
        setWings([]);
        return;
      }

      setLoadingWings(true);
      try {
        const mobileToken = sessionStorage.getItem("mobile_token");
        let baseUrl = sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";
        baseUrl = baseUrl.replace(/\/$/, "");
        if (!baseUrl.startsWith("http")) {
          baseUrl = `https://${baseUrl}`;
        }

        const response = await fetch(`${baseUrl}/pms/wings.json?building_id=${building}`, {
          headers: {
            'Authorization': `Bearer ${mobileToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const wingsData = Array.isArray(data?.wings) ? data.wings : [];
          setWings(wingsData);
        }
      } catch (error) {
        console.error('Error fetching wings:', error);
        setWings([]);
      } finally {
        setLoadingWings(false);
      }
    };

    fetchWings();
  }, [building]);

  // Fetch areas when wing changes
  useEffect(() => {
    const fetchAreas = async () => {
      if (!wing) {
        setAreas([]);
        return;
      }

      setLoadingAreas(true);
      try {
        const mobileToken = sessionStorage.getItem("mobile_token");
        let baseUrl = sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";
        baseUrl = baseUrl.replace(/\/$/, "");
        if (!baseUrl.startsWith("http")) {
          baseUrl = `https://${baseUrl}`;
        }

        const response = await fetch(`${baseUrl}/pms/areas.json?wing_id=${wing}`, {
          headers: {
            'Authorization': `Bearer ${mobileToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const areasData = Array.isArray(data?.areas) ? data.areas : [];
          setAreas(areasData);
        }
      } catch (error) {
        console.error('Error fetching areas:', error);
        setAreas([]);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, [wing]);

  // Fetch floors when area changes
  useEffect(() => {
    const fetchFloors = async () => {
      if (!area) {
        setFloors([]);
        return;
      }

      setLoadingFloors(true);
      try {
        const mobileToken = sessionStorage.getItem("mobile_token");
        let baseUrl = sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";
        baseUrl = baseUrl.replace(/\/$/, "");
        if (!baseUrl.startsWith("http")) {
          baseUrl = `https://${baseUrl}`;
        }

        const response = await fetch(`${baseUrl}/pms/floors.json?area_id=${area}`, {
          headers: {
            'Authorization': `Bearer ${mobileToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const floorsData = Array.isArray(data?.floors) ? data.floors : [];
          setFloors(floorsData);
        }
      } catch (error) {
        console.error('Error fetching floors:', error);
        setFloors([]);
      } finally {
        setLoadingFloors(false);
      }
    };

    fetchFloors();
  }, [area]);

  // Fetch rooms when floor changes
  useEffect(() => {
    const fetchRooms = async () => {
      if (!floor) {
        setRooms([]);
        return;
      }

      setLoadingRooms(true);
      try {
        const mobileToken = sessionStorage.getItem("mobile_token");
        let baseUrl = sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";
        baseUrl = baseUrl.replace(/\/$/, "");
        if (!baseUrl.startsWith("http")) {
          baseUrl = `https://${baseUrl}`;
        }

        const response = await fetch(`${baseUrl}/pms/rooms.json?floor_id=${floor}`, {
          headers: {
            'Authorization': `Bearer ${mobileToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const roomsData = Array.isArray(data?.rooms) ? data.rooms : [];
          setRooms(roomsData);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRooms([]);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, [floor]);

  const handleApplyFilters = () => {
    const filters: MobileAssetFilters = {
      assetName: assetName || undefined,
      assetId: assetId || undefined,
      groupId: group || undefined,
      subgroupId: subgroup || undefined,
      siteId: site || undefined,
      buildingId: building || undefined,
      wingId: wing || undefined,
      areaId: area || undefined,
      floorId: floor || undefined,
      roomId: room || undefined,
      status: status || undefined,
    };
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setAssetName('');
    setAssetId('');
    setGroup('');
    setSubgroup('');
    setSite('');
    setBuilding('');
    setWing('');
    setArea('');
    setFloor('');
    setRoom('');
    setStatus('');
    setSubgroups([]);
    setBuildings([]);
    setWings([]);
    setAreas([]);
    setFloors([]);
    setRooms([]);
  };

  const hasActiveFilters = assetName || assetId || group || subgroup || site || building || wing || area || floor || room || status;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Assets
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {/* Asset Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Asset Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="assetName" className="text-xs">Asset Name</Label>
              <Input
                id="assetName"
                placeholder="Enter asset name"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetId" className="text-xs">Asset ID</Label>
              <Input
                id="assetId"
                placeholder="Enter asset ID"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* Group & Subgroup */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Category</h3>
            
            <div className="space-y-2">
              <Label className="text-xs">Group</Label>
              <Select value={group} onValueChange={setGroup} disabled={loadingGroups}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={loadingGroups ? "Loading..." : "Select group"} />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Subgroup</Label>
              <Select value={subgroup} onValueChange={setSubgroup} disabled={!group || loadingSubgroups}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={
                    !group ? "Select group first" : 
                    loadingSubgroups ? "Loading..." : 
                    "Select subgroup"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {subgroups.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Location</h3>
            
            <div className="space-y-2">
              <Label className="text-xs">Site</Label>
              <Select value={site} onValueChange={setSite} disabled={loadingSites}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={loadingSites ? "Loading..." : "Select site"} />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Building</Label>
              <Select value={building} onValueChange={setBuilding} disabled={!site || loadingBuildings}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={
                    !site ? "Select site first" : 
                    loadingBuildings ? "Loading..." : 
                    "Select building"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Wing</Label>
              <Select value={wing} onValueChange={setWing} disabled={!building || loadingWings}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={
                    !building ? "Select building first" : 
                    loadingWings ? "Loading..." : 
                    "Select wing"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {wings.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Area</Label>
              <Select value={area} onValueChange={setArea} disabled={!wing || loadingAreas}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={
                    !wing ? "Select wing first" : 
                    loadingAreas ? "Loading..." : 
                    "Select area"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Floor</Label>
              <Select value={floor} onValueChange={setFloor} disabled={!area || loadingFloors}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={
                    !area ? "Select area first" : 
                    loadingFloors ? "Loading..." : 
                    "Select floor"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {floors.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Room</Label>
              <Select value={room} onValueChange={setRoom} disabled={!floor || loadingRooms}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={
                    !floor ? "Select floor first" : 
                    loadingRooms ? "Loading..." : 
                    "Select room"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Status</h3>
            
            <div className="space-y-2">
              <Label className="text-xs">Asset Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_use">In Use</SelectItem>
                  <SelectItem value="breakdown">Breakdown</SelectItem>
                  <SelectItem value="in_storage">In Store</SelectItem>
                  <SelectItem value="disposed">Disposed</SelectItem>
                  {/* <SelectItem value="under_maintenance">Under Maintenance</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            className="flex-1"
          >
            Clear All
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1 bg-[#4B003F] hover:bg-[#4B003F]/90"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
