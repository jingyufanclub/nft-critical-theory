import { Navigate, useLocation } from 'react-router-dom'

import { Loading } from 'components'
import { useAuthContext } from './AuthProvider'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, authLoading } = useAuthContext()
  const location = useLocation()

  if (authLoading) {
    return <Loading />
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}

export default RequireAuth
