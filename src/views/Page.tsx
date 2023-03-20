import { Outlet } from 'react-router-dom'
import { Box, Main } from 'grommet'

import { AppFooter, AppHeader } from 'components'

function Page(): JSX.Element {
  return (
    <Box justify="center">
      <AppHeader />
      <Main
        align="start"
        justify="start"
        pad={{ vertical: 'small', horizontal: 'large' }}
        margin={{ bottom: 'medium' }}
      >
        <Outlet />
      </Main>
      <AppFooter />
    </Box>
  )
}

export default Page
