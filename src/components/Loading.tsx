import { Box, Layer, Spinner } from 'grommet'

function Loading(): JSX.Element {
  return (
    <Layer full animation="fadeIn" background={{ color: 'black', opacity: 'medium' }}>
      <Box fill align="center" justify="center">
        <Spinner color="brand" size="small" />
      </Box>
    </Layer>
  )
}

export default Loading
