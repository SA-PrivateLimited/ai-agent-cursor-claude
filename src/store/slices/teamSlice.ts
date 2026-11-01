import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getTeam } from '@/services/api'
import type { RequestStatus, TeamMember } from '@/types'

interface TeamState {
  items: TeamMember[]
  status: RequestStatus
  error: string | null
}

const initialState: TeamState = {
  items: [],
  status: 'idle',
  error: null,
}

export const loadTeam = createAsyncThunk('team/load', async () => getTeam())

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTeam.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadTeam.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadTeam.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unable to load the team.'
      })
  },
})

export const teamReducer = teamSlice.reducer
