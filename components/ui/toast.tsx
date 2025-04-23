"use client"

import React, { useState, useEffect, createContext, useContext } from 'react'
import { Check } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {}
})

export function useToast() {
  return useContext(ToastContext)
}

type ToastProviderProps = {
  children: React.ReactNode
}

type ToastState = {
  message: string
  type: ToastType
  visible: boolean
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, visible: true })

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: false } : null)

      // Remove from DOM after animation completes
      setTimeout(() => {
        setToast(null)
      }, 300)
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: toast.type === 'success' ? '#10B981' : toast.type === 'error' ? '#EF4444' : '#3B82F6',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 9999,
            maxWidth: '300px',
            animation: toast.visible ? 'slideIn 0.3s ease-out' : 'slideOut 0.3s ease-in',
            opacity: toast.visible ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          {toast.type === 'success' && <Check size={18} />}
          <span>{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  )
}

// Simple toast component for direct use
export function Toast({ message, type = 'success' }: { message: string, type?: ToastType }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 9999,
        maxWidth: '300px',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      {type === 'success' && <Check size={18} />}
      <span>{message}</span>
    </div>
  )
}
