// src/context/AppContext.tsx
import React, { ReactNode, createContext, useState } from 'react'

interface AppState {
  user: string | null
  theme: 'light' | 'dark'
}

interface AppContextProps {
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
}

const defaultState: AppState = {
  user: null,
  theme: 'light',
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(defaultState)

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  )
}

export { AppContext, AppProvider }
