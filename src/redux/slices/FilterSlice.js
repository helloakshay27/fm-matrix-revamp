import { createSlice } from '@reduxjs/toolkit';

const initialFilterState = {
  title: '',
  responsible_person_id: '',
  created_by_id: '',
  responsible_person_email: '',
  status: '',
  resource_id: '',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState: {
    activeFilters: { ...initialFilterState },
  },
  reducers: {
    updateFilter: (state, action) => {
      const { filterName, filterValue } = action.payload;
      if (state.activeFilters.hasOwnProperty(filterName)) {
        state.activeFilters[filterName] = filterValue;
      } else {
        console.warn(`FilterSlice: Attempting to update a non-predefined filter key: ${filterName}. Add it to initialFilterState if it's a valid filter.`);
      }
    },
    setMultipleFilters: (state, action) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    clearAllFilters: (state) => {
      state.activeFilters = { ...initialFilterState };
    },
    clearSpecificFilter: (state, action) => {
      const filterName = action.payload;
      if (state.activeFilters.hasOwnProperty(filterName) && initialFilterState.hasOwnProperty(filterName)) {
        state.activeFilters[filterName] = initialFilterState[filterName];
      }
    },
  },
});

export const {
  updateFilter,
  setMultipleFilters,
  clearAllFilters,
  clearSpecificFilter,
} = filterSlice.actions;

export const selectActiveFilters = (state) => state.filters.activeFilters;

export default filtersReducer=filterSlice.reducer;