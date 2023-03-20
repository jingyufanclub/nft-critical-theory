import { Box, Heading } from 'grommet'

import { en } from 'locales'

function Fallback(): JSX.Element {
  return (
    <Box height="100dvh" align="center" justify="center">
      <Heading>{en.error.fallback}</Heading>
    </Box>
  )
}

export default Fallback
