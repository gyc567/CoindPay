import { ReactNode } from 'react'

interface HeaderProps {
  customClass?: string
  buttonClass?: string
  children?: ReactNode
}

export default function Header({ customClass = '', buttonClass = '', children }: HeaderProps) {
  return (
    <header className={customClass}>
      <nav className={buttonClass}>
        {children}
      </nav>
    </header>
  )
}
