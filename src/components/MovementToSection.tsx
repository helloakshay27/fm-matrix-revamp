import React, { useEffect } from 'react';
import { useLocationData } from '@/hooks/useLocationData';

interface MovementToSectionProps {
  site: string;
  setSite: (value: string) => void;
  building: string;
  setBuilding: (value: string) => void;
  wing: string;
  setWing: (value: string) => void;
  area: string;
  setArea: (value: string) => void;
  floor: string;
  setFloor: (value: string) => void;
  room: string;
  setRoom: (value: string) => void;
}

export const MovementToSection: React.FC<MovementToSectionProps> = ({
  site,
  setSite,
  building,
  setBuilding,
  wing,
  setWing,
  area,
  setArea,
  floor,
  setFloor,
  room,
  setRoom,
}) => {
  const {
    sites,
    buildings,
    wings,
    areas,
    floors,
    rooms,
    loading,
    fetchBuildings,
    fetchWings,
    fetchAreas,
    fetchFloors,
    fetchRooms,
  } = useLocationData();

  // Handle cascading dropdown changes
  useEffect(() => {
    if (site) {
      fetchBuildings(site);
      // Clear dependent fields
      setBuilding('');
      setWing('');
      setArea('');
      setFloor('');
      setRoom('');
    }
  }, [site]);

  useEffect(() => {
    if (building) {
      fetchWings(building);
      // Clear dependent fields
      setWing('');
      setArea('');
      setFloor('');
      setRoom('');
    }
  }, [building]);

  useEffect(() => {
    if (wing) {
      fetchAreas(wing);
      // Clear dependent fields
      setArea('');
      setFloor('');
      setRoom('');
    }
  }, [wing]);

  useEffect(() => {
    if (area) {
      fetchFloors(area);
      // Clear dependent fields
      setFloor('');
      setRoom('');
    }
  }, [area]);

  useEffect(() => {
    if (floor) {
      fetchRooms(floor);
      // Clear dependent fields
      setRoom('');
    }
  }, [floor]);

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Movement To</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Site */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Site <span className="text-red-500">*</span>
          </label>
          <select
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading.sites}
          >
            <option value="">Select Site</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id.toString()}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Building */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Building <span className="text-red-500">*</span>
          </label>
          <select
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!site || loading.buildings}
          >
            <option value="">Select Building</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id.toString()}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Wing */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Wing</label>
          <select
            value={wing}
            onChange={(e) => setWing(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!building || loading.wings}
          >
            <option value="">Select Wing</option>
            {wings.map((w) => (
              <option key={w.id} value={w.id.toString()}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Area */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Area</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!wing || loading.areas}
          >
            <option value="">Select Area</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id.toString()}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Floor */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Floor</label>
          <select
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!area || loading.floors}
          >
            <option value="">Select Floor</option>
            {floors.map((f) => (
              <option key={f.id} value={f.id.toString()}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Room */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Room</label>
          <select
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!floor || loading.rooms}
          >
            <option value="">Select Room</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id.toString()}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};