import { ReactNode } from 'react'

interface FooterProps {
  children?: ReactNode
}

export default function Footer({ children }: FooterProps) {
  return <footer>{children}</footer>
}
