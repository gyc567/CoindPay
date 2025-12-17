import { ReactNode } from 'react'

interface LayoutOpenProps {
  children: ReactNode
}

export default function LayoutOpen({ children }: LayoutOpenProps) {
  return <>{children}</>
}
