import { Grommet } from 'grommet'
import { Route, Routes } from 'react-router-dom'

import { Draw, Fallback, Metadata, Page, Prepare } from 'views'
import { ErrorNotifier, StateProvider } from 'components'

import theme from './theme'

function App(): JSX.Element {
  return (
    <Grommet full theme={theme} themeMode="dark">
      <ErrorNotifier>
        <StateProvider>
          <Routes>
            <Route path="/" element={<Page />}>
              <Route index element={<Draw />} />
              <Route path="metadata" element={<Metadata />} />
              <Route path="prepare" element={<Prepare />} />
            </Route>
            <Route path="*" element={<Fallback />} />
          </Routes>
        </StateProvider>
      </ErrorNotifier>
    </Grommet>
  )
}

export default App
