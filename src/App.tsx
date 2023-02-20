import { Grommet } from 'grommet'
import { Route, Routes } from 'react-router-dom'

import { AuthProvider, ErrorNotifier, RequireAuth } from 'components'
import { Draw, Fallback, Home, Mint, Page } from 'views'

import theme from './theme'

function App(): JSX.Element {
  return (
    <Grommet full theme={theme} themeMode="dark">
      <ErrorNotifier>
        <AuthProvider>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Page />}>
              <Route
                path="draw"
                element={
                  <RequireAuth>
                    <Draw />
                  </RequireAuth>
                }
              />
              <Route
                path="mint"
                element={
                  <RequireAuth>
                    <Mint />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="*" element={<Fallback />} />
          </Routes>
        </AuthProvider>
      </ErrorNotifier>
    </Grommet>
  )
}

export default App
