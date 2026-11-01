import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { projectsReducer } from '@/store/slices/projectsSlice'
import { tasksReducer } from '@/store/slices/tasksSlice'
import { teamReducer } from '@/store/slices/teamSlice'
import { uiReducer } from '@/store/slices/uiSlice'

export const rootReducer = combineReducers({
  projects: projectsReducer,
  tasks: tasksReducer,
  team: teamReducer,
  ui: uiReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

export const store = setupStore()

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
