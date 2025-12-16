import { createContext, useContext, ReactNode, useState } from 'react'

interface StudioContextType {
  isStudioMode?: boolean
  setIsStudioMode?: (value: boolean) => void
  chainsExpand?: boolean
  setChainsExpand?: (value: boolean) => void
}

const StudioContext = createContext<StudioContextType>({})

export function StudioProvider({ children }: { children: ReactNode }) {
  const [isStudioMode, setIsStudioMode] = useState(false)
  const [chainsExpand, setChainsExpand] = useState(false)

  return (
    <StudioContext.Provider value={{ isStudioMode, setIsStudioMode, chainsExpand, setChainsExpand }}>
      {children}
    </StudioContext.Provider>
  )
}

export function useStudioContext() {
  const context = useContext(StudioContext)
  if (!context) {
    return {}
  }
  return context
}
