import { Box, Layer, Spinner } from 'grommet'

function Loading(): JSX.Element {
  return (
    <Layer full animation={false}>
      <Box fill align="center" justify="center">
        <Spinner size="large" color="brand" />
      </Box>
    </Layer>
  )
}

export default Loading
