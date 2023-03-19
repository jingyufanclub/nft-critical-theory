import { useContext } from 'react'
import { Box, Header, ResponsiveContext, Select, Text } from 'grommet'

import { Network } from 'common/constants'
import { useStateContext } from 'components'

function AppHeader(): JSX.Element {
  const size = useContext(ResponsiveContext)
  const { network, updateNetwork } = useStateContext()

  return (
    <Header
      background={network === Network.MAINNET ? 'accent-3' : undefined}
      pad={{ horizontal: 'large', vertical: 'small' }}
      justify="between"
    >
      {size !== 'small' && (
        <Box>
          <Text weight="bold">{network}</Text>
        </Box>
      )}
      <Box width="small">
        <Select
          id="network"
          name="network"
          plain
          value={Object.keys(Network)[Object.values(Network).indexOf(network)]}
          options={Object.keys(Network)}
          onChange={({ option }) => updateNetwork(Network[option as keyof typeof Network])}
        />
      </Box>
    </Header>
  )
}

export default AppHeader
