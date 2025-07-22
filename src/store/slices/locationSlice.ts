
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utils/apiClient';

// Types
interface Building {
  id: number;
  name: string;
  site_id: string;
  has_wing: boolean;
  has_floor: boolean;
  has_area: boolean;
  has_room: boolean;
  active: boolean;
  other_detail?: string;
}

interface Wing {
  id: number;
  name: string;
  building_id: string;
  active: boolean;
  building?: Building;
}

interface Area {
  id: number;
  name: string;
  building_id: string;
  wing_id: string;
  active: boolean;
  wing?: Wing;
  building?: Building;
}

interface Floor {
  id: number;
  name: string;
  building_id: string;
  wing_id: number;
  area_id: number;
  active: boolean;
  area?: Area;
  wing?: Wing;
  building?: Building;
}

interface Unit {
  id: number;
  unit_name: string;
  building_id: number;
  wing_id: number;
  area_id: number;
  floor_id: number;
  active: boolean;
  area?: number;
  building?: Building;
  wing?: Wing;
  floor?: Floor;
  area_obj?: Area;
}

interface LocationState {
  buildings: {
    data: Building[];
    loading: boolean;
    error: string | null;
  };
  wings: {
    data: Wing[];
    loading: boolean;
    error: string | null;
  };
  areas: {
    data: Area[];
    loading: boolean;
    error: string | null;
  };
  floors: {
    data: Floor[];
    loading: boolean;
    error: string | null;
  };
  units: {
    data: Unit[];
    loading: boolean;
    error: string | null;
  };
  selectedBuilding: number | null;
  selectedWing: number | null;
  selectedArea: number | null;
  selectedFloor: number | null;
}

// Get selectedSiteId from localStorage
const getSelectedSiteId = () => {
  return localStorage.getItem('selectedSiteId') || '';
};

// Async Thunks
export const fetchBuildings = createAsyncThunk(
  'location/fetchBuildings',
  async () => {
    const siteId = getSelectedSiteId();
    const response = await apiClient.get(`/buildings.json?site_id=${siteId}`);
    return response.data;
  }
);

export const fetchWings = createAsyncThunk(
  'location/fetchWings',
  async (buildingId: number) => {
    const response = await apiClient.get(`/pms/wings.json?building_id=${buildingId}`);
    return response.data.wings || [];
  }
);

export const fetchAreas = createAsyncThunk(
  'location/fetchAreas',
  async ({ buildingId, wingId }: { buildingId: number; wingId: number }) => {
    const response = await apiClient.get(`/pms/areas.json?building_id=${buildingId}&wing_id=${wingId}`);
    return response.data.areas || [];
  }
);

export const fetchFloors = createAsyncThunk(
  'location/fetchFloors',
  async ({ buildingId, wingId, areaId }: { buildingId: number; wingId: number; areaId: number }) => {
    const response = await apiClient.get(`/pms/floors.json?building_id=${buildingId}&wing_id=${wingId}&area_id=${areaId}`);
    return response.data.floors || [];
  }
);

export const fetchUnits = createAsyncThunk(
  'location/fetchUnits',
  async ({ buildingId, wingId, areaId, floorId }: { buildingId: number; wingId: number; areaId: number; floorId: number }) => {
    const response = await apiClient.get(`/pms/units.json?building_id=${buildingId}&wing_id=${wingId}&area_id=${areaId}&floor_id=${floorId}`);
    return Array.isArray(response.data) ? response.data : [response.data];
  }
);

// Create operations
export const createBuilding = createAsyncThunk(
  'location/createBuilding',
  async (buildingData: Partial<Building>) => {
    const siteId = getSelectedSiteId();
    const payload = {
      building: {
        ...buildingData,
        site_id: parseInt(siteId)
      }
    };
    const response = await apiClient.post('/buildings.json', payload);
    return response.data;
  }
);

export const createWing = createAsyncThunk(
  'location/createWing',
  async (wingData: { name: string; building_id: number }) => {
    const payload = {
      pms_wing: {
        ...wingData,
        building_id: wingData.building_id.toString(),
        active: true
      }
    };
    const response = await apiClient.post('/pms/wings.json', payload);
    return response.data;
  }
);

export const createArea = createAsyncThunk(
  'location/createArea',
  async (areaData: { name: string; building_id: number; wing_id: number }) => {
    const payload = {
      pms_area: {
        ...areaData,
        active: true
      }
    };
    const response = await apiClient.post('/pms/areas.json', payload);
    return response.data;
  }
);

export const createFloor = createAsyncThunk(
  'location/createFloor',
  async (floorData: { name: string; building_id: number; wing_id: number; area_id: number }) => {
    const payload = {
      pms_floor: {
        ...floorData,
        active: true
      }
    };
    const response = await apiClient.post('/pms/floors.json', payload);
    return response.data;
  }
);

export const createUnit = createAsyncThunk(
  'location/createUnit',
  async (unitData: { unit_name: string; building_id: number; wing_id: number; area_id: number; floor_id: number; area?: number }) => {
    const payload = {
      pms_unit: {
        ...unitData,
        active: true,
        site_id: parseInt(getSelectedSiteId()),
        entity_id: 1,
        company_id: 111,
        created_by: 12437
      }
    };
    const response = await apiClient.post('/pms/units.json', payload);
    return response.data;
  }
);

// Update operations
export const updateBuilding = createAsyncThunk(
  'location/updateBuilding',
  async ({ id, updates }: { id: number; updates: Partial<Building> }) => {
    const payload = {
      building: updates
    };
    const response = await apiClient.put(`/buildings/${id}.json`, payload);
    return { id, updates };
  }
);

export const updateWing = createAsyncThunk(
  'location/updateWing',
  async ({ id, updates }: { id: number; updates: Partial<Wing> }) => {
    const payload = {
      pms_wing: updates
    };
    const response = await apiClient.put(`/pms/wings/${id}.json`, payload);
    return { id, updates };
  }
);

const initialState: LocationState = {
  buildings: { data: [], loading: false, error: null },
  wings: { data: [], loading: false, error: null },
  areas: { data: [], loading: false, error: null },
  floors: { data: [], loading: false, error: null },
  units: { data: [], loading: false, error: null },
  selectedBuilding: null,
  selectedWing: null,
  selectedArea: null,
  selectedFloor: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setSelectedBuilding: (state, action) => {
      state.selectedBuilding = action.payload;
      state.selectedWing = null;
      state.selectedArea = null;
      state.selectedFloor = null;
      state.wings.data = [];
      state.areas.data = [];
      state.floors.data = [];
      state.units.data = [];
    },
    setSelectedWing: (state, action) => {
      state.selectedWing = action.payload;
      state.selectedArea = null;
      state.selectedFloor = null;
      state.areas.data = [];
      state.floors.data = [];
      state.units.data = [];
    },
    setSelectedArea: (state, action) => {
      state.selectedArea = action.payload;
      state.selectedFloor = null;
      state.floors.data = [];
      state.units.data = [];
    },
    setSelectedFloor: (state, action) => {
      state.selectedFloor = action.payload;
      state.units.data = [];
    },
    clearAllSelections: (state) => {
      state.selectedBuilding = null;
      state.selectedWing = null;
      state.selectedArea = null;
      state.selectedFloor = null;
      state.wings.data = [];
      state.areas.data = [];
      state.floors.data = [];
      state.units.data = [];
    }
  },
  extraReducers: (builder) => {
    // Buildings
    builder
      .addCase(fetchBuildings.pending, (state) => {
        state.buildings.loading = true;
        state.buildings.error = null;
      })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.buildings.loading = false;
        state.buildings.data = action.payload;
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.buildings.loading = false;
        state.buildings.error = action.error.message || 'Failed to fetch buildings';
      })
      // Wings
      .addCase(fetchWings.pending, (state) => {
        state.wings.loading = true;
        state.wings.error = null;
      })
      .addCase(fetchWings.fulfilled, (state, action) => {
        state.wings.loading = false;
        state.wings.data = action.payload;
      })
      .addCase(fetchWings.rejected, (state, action) => {
        state.wings.loading = false;
        state.wings.error = action.error.message || 'Failed to fetch wings';
      })
      // Areas
      .addCase(fetchAreas.pending, (state) => {
        state.areas.loading = true;
        state.areas.error = null;
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.areas.loading = false;
        state.areas.data = action.payload;
      })
      .addCase(fetchAreas.rejected, (state, action) => {
        state.areas.loading = false;
        state.areas.error = action.error.message || 'Failed to fetch areas';
      })
      // Floors
      .addCase(fetchFloors.pending, (state) => {
        state.floors.loading = true;
        state.floors.error = null;
      })
      .addCase(fetchFloors.fulfilled, (state, action) => {
        state.floors.loading = false;
        state.floors.data = action.payload;
      })
      .addCase(fetchFloors.rejected, (state, action) => {
        state.floors.loading = false;
        state.floors.error = action.error.message || 'Failed to fetch floors';
      })
      // Units
      .addCase(fetchUnits.pending, (state) => {
        state.units.loading = true;
        state.units.error = null;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.units.loading = false;
        state.units.data = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.units.loading = false;
        state.units.error = action.error.message || 'Failed to fetch units';
      })
      // Update Building
      .addCase(updateBuilding.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const buildingIndex = state.buildings.data.findIndex(building => building.id === id);
        if (buildingIndex !== -1) {
          state.buildings.data[buildingIndex] = { ...state.buildings.data[buildingIndex], ...updates };
        }
      })
      // Update Wing
      .addCase(updateWing.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const wingIndex = state.wings.data.findIndex(wing => wing.id === id);
        if (wingIndex !== -1) {
          state.wings.data[wingIndex] = { ...state.wings.data[wingIndex], ...updates };
        }
      });
  },
});

export const {
  setSelectedBuilding,
  setSelectedWing,
  setSelectedArea,
  setSelectedFloor,
  clearAllSelections
} = locationSlice.actions;

export const locationReducer = locationSlice.reducer;
