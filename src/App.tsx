import { Grommet } from 'grommet'
import { Route, Routes } from 'react-router-dom'

import { AuthProvider, ErrorNotifier, RequireAuth } from 'components'
import { Fallback, Home, Mint, Page } from 'views'

import mintTheme from './mintTheme'

function App(): JSX.Element {
  return (
    <Grommet full theme={mintTheme} themeMode="dark">
      <ErrorNotifier>
        <AuthProvider>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Page />}>
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
