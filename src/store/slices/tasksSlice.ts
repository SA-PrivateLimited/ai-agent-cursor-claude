import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { createTask as createTaskRequest, getTasks, updateTask as updateTaskRequest } from '@/services/api'
import type { RequestStatus, Task, TaskDraft } from '@/types'

interface TasksState {
  items: Task[]
  status: RequestStatus
  error: string | null
  mutationStatus: 'idle' | 'saving' | 'failed'
  mutationError: string | null
  pendingRollback: Task | null
}

const initialState: TasksState = {
  items: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
  mutationError: null,
  pendingRollback: null,
}

export const loadTasks = createAsyncThunk('tasks/load', async () => getTasks())

export const createTask = createAsyncThunk('tasks/create', async (draft: TaskDraft) => createTaskRequest(draft))

export const updateTask = createAsyncThunk(
  'tasks/update',
  async (input: { id: string; changes: TaskDraft }) => updateTaskRequest(input.id, input.changes),
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskMutation(state) {
      state.mutationStatus = 'idle'
      state.mutationError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTasks.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unable to load tasks.'
      })
      .addCase(createTask.pending, (state) => {
        state.mutationStatus = 'saving'
        state.mutationError = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.mutationStatus = 'idle'
        state.items.push(action.payload)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.error.message ?? 'Unable to create the task.'
      })
      .addCase(updateTask.pending, (state, action) => {
        state.mutationStatus = 'saving'
        state.mutationError = null
        const task = state.items.find((item) => item.id === action.meta.arg.id)
        if (!task) return
        state.pendingRollback = { ...task, labels: [...task.labels] }
        task.title = action.meta.arg.changes.title
        task.description = action.meta.arg.changes.description
        task.projectId = action.meta.arg.changes.projectId
        task.assigneeId = action.meta.arg.changes.assigneeId
        task.status = action.meta.arg.changes.status
        task.priority = action.meta.arg.changes.priority
        task.dueDate = action.meta.arg.changes.dueDate
        task.estimateHours = action.meta.arg.changes.estimateHours
        task.labels = [...action.meta.arg.changes.labels]
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.mutationStatus = 'idle'
        state.pendingRollback = null
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.items[index] = action.payload
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.error.message ?? 'Unable to update the task.'
        if (!state.pendingRollback) return
        const index = state.items.findIndex((item) => item.id === state.pendingRollback?.id)
        if (index >= 0 && state.pendingRollback) state.items[index] = state.pendingRollback
        state.pendingRollback = null
      })
  },
})

export const { clearTaskMutation } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
