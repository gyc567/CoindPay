import { createContext, useContext, ReactNode, useState } from 'react'

interface StudioContextType {
  isStudioMode: boolean
  setIsStudioMode: (value: boolean) => void
  chainsExpand: boolean
  setChainsExpand: (value: boolean) => void
}

const defaultContextValue: StudioContextType = {
  isStudioMode: false,
  setIsStudioMode: () => {},
  chainsExpand: false,
  setChainsExpand: () => {},
}

const StudioContext = createContext<StudioContextType>(defaultContextValue)

export function StudioProvider({ children }: { children: ReactNode }) {
  const [isStudioMode, setIsStudioMode] = useState(false)
  const [chainsExpand, setChainsExpand] = useState(false)

  return (
    <StudioContext.Provider value={{ isStudioMode, setIsStudioMode, chainsExpand, setChainsExpand }}>
      {children}
    </StudioContext.Provider>
  )
}

export function useStudioContext(): StudioContextType {
  const context = useContext(StudioContext)
  if (!context) {
    throw new Error('useStudioContext must be used within StudioProvider')
  }
  return context
}
