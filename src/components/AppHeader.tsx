import { useContext } from 'react'
import { Box, Button, Header, ResponsiveContext, Select, Text } from 'grommet'

import { useEffect } from 'react'

import { Network } from 'common/constants'
import { en } from 'locales'
import { useStateContext } from 'components'

function AppHeader(): JSX.Element {
  const size = useContext(ResponsiveContext)
  const { network, updateNetwork, xumm, isXummConnected, updateIsXummConnected } = useStateContext()

  async function signIntoXUMM(): Promise<void> {
    try {
      await xumm.authorize()
    } catch (error) {
      if (error instanceof Error) {
        window.alert(error.message)
      }
    }
  }

  async function signOutXUMM(): Promise<void> {
    xumm.logout()
    updateIsXummConnected(false)
  }

  useEffect(() => {
    xumm.on('success', async () => {
      updateIsXummConnected(true)
    })

    return () => {
      xumm.off('success', async () => {
        console.log('Using xumm.off to turn off xumm.on from useEffect')
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      <Box width={size === 'small' ? '140px' : 'small'}>
        <Select
          id="network"
          name="network"
          a11yTitle={en.header.selectNetwork}
          plain
          value={Object.keys(Network)[Object.values(Network).indexOf(network)]}
          options={Object.keys(Network)}
          onChange={({ option }) => updateNetwork(Network[option as keyof typeof Network])}
          disabled={isXummConnected}
        />
      </Box>
      <Box width={size === 'small' ? '180px' : 'small'}>
        {isXummConnected ? (
          <Button label={en.xumm.disconnect} onClick={signOutXUMM} />
        ) : (
          <Button label={en.xumm.connect} onClick={signIntoXUMM} />
        )}
      </Box>
    </Header>
  )
}

export default AppHeader
