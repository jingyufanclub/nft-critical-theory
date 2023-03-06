import { Header, Menu, Text } from 'grommet'

import { Network } from 'common/constants'
import { useStateContext } from 'components'

import { en } from 'locales'

function AppHeader(): JSX.Element {
  const { network, updateNetwork } = useStateContext()

  const menuItems = [
    {
      label: en.header.devnet,
      onClick: () => updateNetwork(Network.DEVNET),
    },
    {
      label: en.header.mainnet,
      onClick: () => updateNetwork(Network.MAINNET),
    },
    {
      label: en.header.testnet,
      onClick: () => updateNetwork(Network.TESTNET),
    },
  ]

  return (
    <Header
      background={network === Network.MAINNET ? 'accent-3' : undefined}
      pad={{ horizontal: 'large', vertical: 'small' }}
      justify="between"
    >
      <Text weight="bold">{Object.keys(Network)[Object.values(Network).indexOf(network)]}</Text>
      <Text weight="bold">{network}</Text>
      <Menu label={en.header.menuLabel} items={menuItems} />
    </Header>
  )
}

export default AppHeader
