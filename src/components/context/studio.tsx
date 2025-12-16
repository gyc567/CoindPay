import { createContext, useContext, ReactNode } from 'react'

interface StudioContextType {
  isStudioMode?: boolean
  setIsStudioMode?: (value: boolean) => void
}

const StudioContext = createContext<StudioContextType>({})

export function StudioProvider({ children }: { children: ReactNode }) {
  return <StudioContext.Provider value={{}}>{children}</StudioContext.Provider>
}

export function useStudioContext() {
  return useContext(StudioContext)
}
