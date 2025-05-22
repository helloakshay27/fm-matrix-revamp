import { configureStore } from '@reduxjs/toolkit'
import { createProjectReducer, fetchProjectsReducer } from './slices/projectSlice'
import { userReducer } from './slices/userSlice'
import { fetchTagsReducer } from './slices/tagsSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    fetchTag: fetchTagsReducer,
    createProject: createProjectReducer,
    fetchProjects: fetchProjectsReducer
  },
})