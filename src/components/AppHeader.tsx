import { useContext } from 'react'
import { Box, Button, Header, ResponsiveContext, Select, Text } from 'grommet'

import { useEffect, useState } from 'react'

import { Network } from 'common/constants'
import { useStateContext } from 'components'

import { XummPkce } from 'xumm-oauth2-pkce'

//import { XummSdk } from 'xumm-sdk'
//import 'https://xumm.app/assets/cdn/xumm-oauth2-pkce.min.js?v=2.7.1'
//import 'https://xumm.app/assets/cdn/xumm.min.js'



function AppHeader(): JSX.Element {
  const size = useContext(ResponsiveContext)
  const { network, updateNetwork } = useStateContext()
  const xumm = new XummPkce('c6f8ad59-180f-47c1-8c87-2eaf9b8cca26')
  const [isConnected, setIsConnected] = useState(false)

  //const [XummClient, setXumm] = useState<typeof xumm | null>(null)
  

  // const xummSignInHandler = (state) => {
  //   if (state.me) {
  //     const { sdk, me } = state;
  //     console.log("state", me);
  //     // Also: sdk » xumm-sdk (npm)
  //   }
  // };



  async function signIntoXUMM(): Promise<void> {
    try {
      xumm.authorize()
    } catch (error: any) {
      console.log('Error message: ', error.message)
      window.alert(error.message)
    }
  }



  async function signOutXUMM(): Promise<void> {
    console.log('log out clicked!')
    xumm.logout()
    setIsConnected(false)
    //    setXumm(null)
    //console.log('Your isConnected variable is ', isConnected)
  }

  // xumm.on('logout', async () => {
  //   console.log('logout event CAUGHT')
  //   const state = await xumm.state()
  //   console.log('state after logout is', state)
  //   setXumm(null)
  // })

  useEffect( () => {
    xumm.on('success', async () => {
      console.log('success detected')
      // try {
//        window.state = await xumm.state()
//        window.sdk = window.state.sdk
      // } catch (error: any) {
      //   console.log('Error message for xumm.state: ', error.message)
      //   window.alert(error.message)
      // }
//      console.log('state is', window.state)
//      console.log('sdk is ', window.sdk)
      setIsConnected(true)
    })

    console.log('xumm.on set up once')

    return () => {
      xumm.off('success', async () => {
        console.log('Using xumm.off to turn off xumm.on from useEffect')
      })
    }
  }, [] )

  useEffect( () => {
    console.log('isConnected after useEffect is ', isConnected)
  }, [isConnected])


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
        <Button label="Logout" onClick={signOutXUMM} disabled={!isConnected}/>
      </Box>
    </Header>
  )
}

export default AppHeader
