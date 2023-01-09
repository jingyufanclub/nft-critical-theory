import { createContext, useContext, useState } from 'react'

type AuthContextType = {
  user: boolean
  authLoading: boolean
  onSignIn: () => void
  onSignOut: () => void
}

const defaultAuthContext: AuthContextType = {
  user: false,
  authLoading: true,
  onSignIn: () => {},
  onSignOut: () => {},
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext)

function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<boolean>(false)
  const [authLoading, setAuthLoading] = useState<boolean>(false)

  async function handleSignIn() {
    setUser(true)
    setAuthLoading(false)
  }

  async function handleSignOut() {
    setUser(false)
  }

  const value = {
    user,
    authLoading,
    onSignIn: handleSignIn,
    onSignOut: handleSignOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  return useContext(AuthContext)
}

export default AuthProvider
