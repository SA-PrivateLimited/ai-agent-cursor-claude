import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { setupStore, type RootState } from '@/app/store'

interface Options extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>
}

export function renderWithStore(ui: ReactElement, options: Options = {}) {
  const { preloadedState, ...renderOptions } = options
  const store = setupStore(preloadedState)

  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
