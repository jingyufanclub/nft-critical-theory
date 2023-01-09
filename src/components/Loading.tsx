import { Box, Layer, Spinner } from 'grommet'

function Loading(): JSX.Element {
  return (
    <Layer full animation={false}>
      <Box fill align="center" justify="center">
        <Spinner size="large" color="accent-1" />
      </Box>
    </Layer>
  )
}

export default Loading
