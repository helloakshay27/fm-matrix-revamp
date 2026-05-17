import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { EnhancedSelect } from '@/components/ui/enhanced-select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import {
  fetchBuildings,
  fetchWings,
  fetchAreas,
  fetchFloors,
  fetchRooms,
} from '@/store/slices/locationSlice';
import { getToken, getBaseUrl } from '@/utils/auth';
import { toast } from 'sonner';

interface GoldenQrRecord {
  id?: number;
  building_id?: string | number;
  wing_id?: string | number;
  area_id?: string | number;
  floor?: string | number;
  room?: string | number;
  mark_golden?: string | boolean;
  fields_for?: string;
  [key: string]: any;
}

export function GoldenQrSetupPage() {
  const dispatch = useAppDispatch();
  const { buildings, wings, areas, floors, rooms } = useAppSelector(
    (state) => state.location
  );

  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [tableData, setTableData] = useState<GoldenQrRecord[]>([]);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);

  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedWing, setSelectedWing] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [markGolden, setMarkGolden] = useState(false);
  const [showRequester, setShowRequester] = useState(false);

  useEffect(() => {
    dispatch(fetchBuildings());
    loadTableData();
  }, [dispatch]);

  useEffect(() => {
    if (selectedBuilding) {
      setSelectedWing('');
      setSelectedArea('');
      setSelectedFloor('');
      setSelectedRoom('');
      dispatch(fetchWings(Number(selectedBuilding)));
    }
  }, [dispatch, selectedBuilding]);

  useEffect(() => {
    if (selectedBuilding) {
      setSelectedArea('');
      setSelectedFloor('');
      setSelectedRoom('');
      dispatch(
        fetchAreas({
          buildingId: Number(selectedBuilding),
          wingId: selectedWing ? Number(selectedWing) : undefined,
        })
      );
    }
  }, [dispatch, selectedBuilding, selectedWing]);

  useEffect(() => {
    if (selectedArea) {
      setSelectedFloor('');
      setSelectedRoom('');
      dispatch(
        fetchFloors({
          buildingId: Number(selectedBuilding) || 0,
          wingId: selectedWing ? Number(selectedWing) : 0,
          areaId: Number(selectedArea),
        })
      );
    }
  }, [dispatch, selectedArea]);

  useEffect(() => {
    if (selectedFloor) {
      setSelectedRoom('');
      dispatch(
        fetchRooms({
          buildingId: Number(selectedBuilding) || 0,
          wingId: selectedWing ? Number(selectedWing) : 0,
          areaId: Number(selectedArea) || 0,
          floorId: Number(selectedFloor),
        })
      );
    }
  }, [dispatch, selectedFloor]);

  const loadTableData = async () => {
    setIsLoadingTable(true);
    try {
      const baseUrl = getBaseUrl();
      const token = getToken();
      const response = await fetch(
        `${baseUrl}/pms/account_setups/get_additional_fields.json?q[fields_for_eq]=complaint_golden_ticket`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      const records = Array.isArray(data)
        ? data
        : data.additional_fields || data.data || data.records || [];
      setTableData(records);
    } catch {
      toast.error('Failed to load Golden QR records');
    } finally {
      setIsLoadingTable(false);
    }
  };

  const resetForm = () => {
    setSelectedBuilding('');
    setSelectedWing('');
    setSelectedArea('');
    setSelectedFloor('');
    setSelectedRoom('');
    setMarkGolden(false);
    setShowRequester(false);
  };

  const handleSubmit = async () => {
    if (!selectedBuilding) {
      toast.error('Please select a building');
      return;
    }

    setIsSubmitting(true);
    try {
      const baseUrl = getBaseUrl();
      const token = getToken();
      const payload = {
        content: {
          building_id: selectedBuilding,
          wing_id: selectedWing,
          area_id: selectedArea,
          floor: selectedFloor,
          room: selectedRoom,
        },
        fields_for: 'ComplaintGoldenQr',
        mark_golden_ticket: markGolden ? 'true' : 'false',
        show_requester: showRequester ? 'true' : 'false',
      };

      const response = await fetch(
        `${baseUrl}/pms/account_setups/create_additional_fields.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error('Failed to save');

      toast.success('Golden QR setup saved successfully');
      resetForm();
      setShowDialog(false);
      loadTableData();
    } catch {
      toast.error('Failed to save Golden QR setup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBuildingName = (id: string | number) =>
    buildings.data?.find((b) => String(b.id) === String(id))?.name || id;

  const getWingName = (id: string | number) =>
    wings.data?.find((w) => String(w.id) === String(id))?.name || id;

  const getAreaName = (id: string | number) =>
    areas.data?.find((a) => String(a.id) === String(id))?.name || id;

  const getFloorName = (id: string | number) =>
    floors.data?.find((f) => String(f.id) === String(id))?.name || id;

  const getRoomName = (id: string | number) =>
    rooms.data?.find((r) => String(r.id) === String(id))?.name || id;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Golden QR Setup</h1>
        <Button
          onClick={() => setShowDialog(true)}
          className="bg-[#C72030] hover:bg-[#a01828] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoadingTable ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#C72030]" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5]">
                <TableHead className="font-semibold text-gray-700">Sr. No.</TableHead>
                <TableHead className="font-semibold text-gray-700">Building</TableHead>
                <TableHead className="font-semibold text-gray-700">Wing</TableHead>
                <TableHead className="font-semibold text-gray-700">Area</TableHead>
                <TableHead className="font-semibold text-gray-700">Floor</TableHead>
                <TableHead className="font-semibold text-gray-700">Room</TableHead>
                <TableHead className="font-semibold text-gray-700">Golden Ticket</TableHead>
                <TableHead className="font-semibold text-gray-700">Show Requester</TableHead>
                <TableHead className="font-semibold text-gray-700">QR Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((record, index) => {
                  const content = record.content || record;
                  return (
                    <TableRow key={record.id ?? index} className="hover:bg-gray-50">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{getBuildingName(content.building_id)}</TableCell>
                      <TableCell>{getWingName(content.wing_id) || '-'}</TableCell>
                      <TableCell>{getAreaName(content.area_id) || '-'}</TableCell>
                      <TableCell>{getFloorName(content.floor) || '-'}</TableCell>
                      <TableCell>{getRoomName(content.room) || '-'}</TableCell>
                      <TableCell>
                        {String(record.mark_golden_ticket) === 'true' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {String(record.show_requester) === 'true' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.qr_code_url ? (
                          <img
                            src={record.qr_code_url}
                            alt="QR Code"
                            className="w-16 h-16 object-contain cursor-pointer hover:opacity-75 transition-opacity"
                            onClick={() => setQrModalUrl(record.qr_code_url)}
                          />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* QR Code Modal */}
      <Dialog open={!!qrModalUrl} onOpenChange={(open) => !open && setQrModalUrl(null)}>
        <DialogContent className="max-w-sm flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">QR Code</DialogTitle>
          </DialogHeader>
          {qrModalUrl && (
            <img
              src={qrModalUrl}
              alt="QR Code"
              className="w-64 h-64 object-contain mt-2"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Add Golden QR Setup
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Building */}
            <EnhancedSelect
              label={<span>Building <span className="text-red-500">*</span></span>}
              value={selectedBuilding}
              onChange={(val) => setSelectedBuilding(String(val))}
              options={buildings.data?.map((b) => ({ value: String(b.id), label: b.name })) || []}
              placeholder="Search and Select Building"
              searchable={true}
              fullWidth
            />

            {/* Wing */}
            <EnhancedSelect
              label="Wing"
              value={selectedWing}
              onChange={(val) => setSelectedWing(String(val))}
              options={wings.data?.map((w) => ({ value: String(w.id), label: w.name })) || []}
              placeholder="Search and Select Wing"
              searchable={true}
              disabled={!selectedBuilding}
              fullWidth
            />

            {/* Area */}
            <EnhancedSelect
              label="Area"
              value={selectedArea}
              onChange={(val) => setSelectedArea(String(val))}
              options={areas.data?.map((a) => ({ value: String(a.id), label: a.name })) || []}
              placeholder="Search and Select Area"
              searchable={true}
              disabled={!selectedBuilding}
              fullWidth
            />

            {/* Floor */}
            <EnhancedSelect
              label="Floor"
              value={selectedFloor}
              onChange={(val) => setSelectedFloor(String(val))}
              options={floors.data?.map((f) => ({ value: String(f.id), label: f.name })) || []}
              placeholder="Search and Select Floor"
              searchable={true}
              disabled={!selectedArea}
              fullWidth
            />

            {/* Room */}
            <EnhancedSelect
              label="Room"
              value={selectedRoom}
              onChange={(val) => setSelectedRoom(String(val))}
              options={rooms.data?.map((r) => ({ value: String(r.id), label: r.name })) || []}
              placeholder="Search and Select Room"
              searchable={true}
              disabled={!selectedFloor}
              fullWidth
            />

            {/* Mark as Golden Ticket */}
            <div className="flex items-center gap-3 pt-1">
              <Checkbox
                id="mark-golden"
                checked={markGolden}
                onCheckedChange={(checked) => setMarkGolden(Boolean(checked))}
              />
              <Label
                htmlFor="mark-golden"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Mark as Golden Ticket
              </Label>
            </div>

            {/* Show Requester */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="show-requester"
                checked={showRequester}
                onCheckedChange={(checked) => setShowRequester(Boolean(checked))}
              />
              <Label
                htmlFor="show-requester"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Show Requester
              </Label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setShowDialog(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#C72030] hover:bg-[#a01828] text-white"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
