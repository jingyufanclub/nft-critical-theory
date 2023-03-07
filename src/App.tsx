import { Grommet } from 'grommet'
import { Route, Routes } from 'react-router-dom'

import { Draw, Fallback, Home, Metadata, Mint, Page } from 'views'
import { ErrorNotifier, StateProvider } from 'components'

import theme from './theme'

function App(): JSX.Element {
  return (
    <Grommet full theme={theme} themeMode="dark">
      <ErrorNotifier>
        <StateProvider>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Page />}>
              <Route path="draw" element={<Draw />} />
              <Route path="metadata" element={<Metadata />} />
              <Route path="mint" element={<Mint />} />
            </Route>
            <Route path="*" element={<Fallback />} />
          </Routes>
        </StateProvider>
      </ErrorNotifier>
    </Grommet>
  )
}

export default App
