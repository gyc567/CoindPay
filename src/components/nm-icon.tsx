import React from 'react'

interface NmIconProps {
  type: string
  className?: string
}

export default function NmIcon({ type, className = '' }: NmIconProps) {
  const getIconContent = (iconType: string) => {
    switch (iconType) {
      case 'icon-user_outline':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="2" />
          </svg>
        )
    }
  }

  return <span className={`inline-flex items-center justify-center ${className}`}>{getIconContent(type)}</span>
}
