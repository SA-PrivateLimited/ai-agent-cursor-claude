import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getProjects } from '@/services/api'
import type { Project, RequestStatus } from '@/types'

interface ProjectsState {
  items: Project[]
  status: RequestStatus
  error: string | null
}

const initialState: ProjectsState = {
  items: [],
  status: 'idle',
  error: null,
}

export const loadProjects = createAsyncThunk('projects/load', async () => getProjects())

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProjects.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadProjects.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadProjects.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unable to load projects.'
      })
  },
})

export const projectsReducer = projectsSlice.reducer
