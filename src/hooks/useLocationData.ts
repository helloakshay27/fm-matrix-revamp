import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/config/apiConfig';

interface Site {
  id: number;
  name: string;
}

interface Building {
  id: number;
  name: string;
}

interface Wing {
  id: number;
  name: string;
}

interface Area {
  id: number;
  name: string;
}

interface Floor {
  id: number;
  name: string;
}

interface Room {
  id: number;
  name: string;
}

export const useLocationData = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [wings, setWings] = useState<Wing[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  
  const [loading, setLoading] = useState({
    sites: false,
    buildings: false,
    wings: false,
    areas: false,
    floors: false,
    rooms: false,
  });

  // Fetch sites
  const fetchSites = async () => {
    setLoading(prev => ({ ...prev, sites: true }));
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/pms/sites.json`, {
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` }
      });
      setSites(response.data || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setSites([]);
    } finally {
      setLoading(prev => ({ ...prev, sites: false }));
    }
  };

  // Fetch buildings
  const fetchBuildings = async (siteId: string) => {
    if (!siteId) {
      setBuildings([]);
      return;
    }
    
    setLoading(prev => ({ ...prev, buildings: true }));
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/pms/sites/${siteId}/buildings.json`, {
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` }
      });
      setBuildings(response.data || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setBuildings([]);
    } finally {
      setLoading(prev => ({ ...prev, buildings: false }));
    }
  };

  // Fetch wings
  const fetchWings = async (buildingId: string) => {
    if (!buildingId) {
      setWings([]);
      return;
    }
    
    setLoading(prev => ({ ...prev, wings: true }));
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/pms/buildings/${buildingId}/wings.json`, {
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` }
      });
      setWings(response.data || []);
    } catch (error) {
      console.error('Error fetching wings:', error);
      setWings([]);
    } finally {
      setLoading(prev => ({ ...prev, wings: false }));
    }
  };

  // Fetch areas
  const fetchAreas = async (wingId: string) => {
    if (!wingId) {
      setAreas([]);
      return;
    }
    
    setLoading(prev => ({ ...prev, areas: true }));
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/pms/wings/${wingId}/areas.json`, {
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` }
      });
      setAreas(response.data || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    } finally {
      setLoading(prev => ({ ...prev, areas: false }));
    }
  };

  // Fetch floors
  const fetchFloors = async (areaId: string) => {
    if (!areaId) {
      setFloors([]);
      return;
    }
    
    setLoading(prev => ({ ...prev, floors: true }));
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/pms/areas/${areaId}/floors.json`, {
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` }
      });
      setFloors(response.data || []);
    } catch (error) {
      console.error('Error fetching floors:', error);
      setFloors([]);
    } finally {
      setLoading(prev => ({ ...prev, floors: false }));
    }
  };

  // Fetch rooms
  const fetchRooms = async (floorId: string) => {
    if (!floorId) {
      setRooms([]);
      return;
    }
    
    setLoading(prev => ({ ...prev, rooms: true }));
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/pms/floors/${floorId}/rooms.json`, {
        headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` }
      });
      setRooms(response.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
    } finally {
      setLoading(prev => ({ ...prev, rooms: false }));
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return {
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
  };
};