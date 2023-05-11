import { useContext } from 'react'
import { Box, Button, Header, ResponsiveContext, Select, Text } from 'grommet'

import { useEffect, useState } from 'react'

import { Network } from 'common/constants'
import { useStateContext } from 'components'
import { XummTypes } from 'xumm-sdk'
import { XrplError } from 'xrpl'

function AppHeader(): JSX.Element {
  const size = useContext(ResponsiveContext)
  const { network, updateNetwork, xumm, isXummConnected, updateIsXummConnected } = useStateContext()

  async function signIntoXUMM(): Promise<void> {
    try {
      xumm.authorize()
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error message: ', error.message)
        window.alert(error.message)
      }
    }
  }

  async function signOutXUMM(): Promise<void> {
    console.log('log out clicked!')
    xumm.logout()
    updateIsXummConnected(false)
  }

  useEffect(() => {
    xumm.on('success', async () => {
      console.log('success detected')
      updateIsXummConnected(true)
    })

    console.log('xumm.on set up once')

    return () => {
      xumm.off('success', async () => {
        console.log('Using xumm.off to turn off xumm.on from useEffect')
      })
    }
  }, [])

  return (
    <Header
      background={network === Network.MAINNET ? 'accent-3' : undefined}
      pad={{ horizontal: 'large', vertical: 'small' }}
      justify="between"
    >
      <Box>{size !== 'small' && <Text weight="bold">{network}</Text>}</Box>
      <Box width={size === 'small' ? '140px' : 'small'}>
        <Select
          id="network"
          name="network"
          plain
          value={Object.keys(Network)[Object.values(Network).indexOf(network)]}
          options={Object.keys(Network)}
          onChange={({ option }) => updateNetwork(Network[option as keyof typeof Network])}
        />
      </Box>
      <Box width={size === 'small' ? '100px' : 'small'}>
        <Button label="Connect XUMM" onClick={signIntoXUMM} />
        <Button label="Logout" onClick={signOutXUMM} disabled={!isXummConnected}/>
      </Box>
    </Header>
  )
}

export default AppHeader
