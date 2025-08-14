import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utils/apiClient';

interface Building {
  id: number;
  name: string;
  has_wing: boolean;
  has_floor: boolean;
  has_area: boolean;
  has_room: boolean;
  available_seats: number | null;
  available_parkings: number | null;
}

interface Area {
  id: number;
  name: string;
}

interface ServiceFilterState {
  buildings: Building[];
  areas: Area[];
  loading: {
    buildings: boolean;
    areas: boolean;
  };
  error: {
    buildings: string | null;
    areas: string | null;
  };
}

const initialState: ServiceFilterState = {
  buildings: [],
  areas: [],
  loading: {
    buildings: false,
    areas: false,
  },
  error: {
    buildings: null,
    areas: null,
  },
};

// Fetch buildings by site ID
export const fetchBuildings = createAsyncThunk(
  'serviceFilter/fetchBuildings',
  async (siteId: number) => {
    const response = await apiClient.get(`/pms/sites/${siteId}/buildings.json`);
    return response.data.buildings.map((item: any) => item);
  }
);

// Fetch areas by wing ID
export const fetchAreas = createAsyncThunk(
  'serviceFilter/fetchAreas',
  async (wingId: number) => {
    const response = await apiClient.get(`/pms/buildings/${wingId}/areas.json`);
    return response.data;
  }
);

const serviceFilterSlice = createSlice({
  name: 'serviceFilter',
  initialState,
  reducers: {
    clearAreas: (state) => {
      state.areas = [];
      state.error.areas = null;
    },
    clearError: (state, action) => {
      const { type } = action.payload;
      state.error[type as keyof typeof state.error] = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch buildings
    builder
      .addCase(fetchBuildings.pending, (state) => {
        state.loading.buildings = true;
        state.error.buildings = null;
      })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.loading.buildings = false;
        state.buildings = action.payload;
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading.buildings = false;
        state.error.buildings = action.error.message || 'Failed to fetch buildings';
      });

    // Fetch areas
    builder
      .addCase(fetchAreas.pending, (state) => {
        state.loading.areas = true;
        state.error.areas = null;
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.loading.areas = false;
        state.areas = action.payload;
      })
      .addCase(fetchAreas.rejected, (state, action) => {
        state.loading.areas = false;
        state.error.areas = action.error.message || 'Failed to fetch areas';
      });
  },
});

export const { clearAreas, clearError } = serviceFilterSlice.actions;
export default serviceFilterSlice.reducer;