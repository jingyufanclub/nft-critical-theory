import { Outlet } from 'react-router-dom'
import { Box, Main } from 'grommet'

import { AppHeader } from 'components'

function Page(): JSX.Element {
  return (
    <Box fill flex justify="center">
      <AppHeader />
      <Main
        flex
        align="start"
        justify="start"
        pad={{ vertical: 'small', horizontal: 'large' }}
        margin={{ bottom: 'medium' }}
      >
        <Outlet />
      </Main>
    </Box>
  )
}

export default Page
