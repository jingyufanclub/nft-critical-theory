import { Outlet } from 'react-router-dom'
import { Box, Main } from 'grommet'

function Page(): JSX.Element {
  return (
    <Box fill flex justify="center" pad="medium">
      <Main flex align="start" justify="start" pad="medium">
        <Outlet />
      </Main>
    </Box>
  )
}

export default Page
