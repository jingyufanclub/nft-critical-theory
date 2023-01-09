import { Notification, StatusType } from 'grommet'
import { createContext, useContext, useState } from 'react'

import { en } from '../locales'

type ErrorContextType = {
  showError: (message: string, status?: StatusType) => void
}

const defaultErrorContext: ErrorContextType = {
  showError: () => {},
}

const ErrorContext = createContext<ErrorContextType>(defaultErrorContext)

function ErrorNotifier({ children }: { children: JSX.Element }) {
  const [visible, setVisible] = useState<boolean>(false)
  const [status, setStatus] = useState<StatusType | undefined>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)

  function handleError(message: string, status?: StatusType) {
    setMessage(message)
    setStatus(status)
    setVisible(true)
  }

  const value = {
    showError: handleError,
  }

  return (
    <ErrorContext.Provider value={value}>
      {visible && message && (
        <Notification
          toast={{ position: 'bottom-right', autoClose: false }}
          status={status}
          title={en.error.generic}
          message={message}
          onClose={() => setVisible(false)}
        />
      )}
      {children}
    </ErrorContext.Provider>
  )
}

export function useErrorContext() {
  return useContext(ErrorContext)
}

export default ErrorNotifier
