import { useContext } from 'react'
import { Box, Button, Header, ResponsiveContext, Select, Text } from 'grommet'
//import { XummSdk } from 'xumm-sdk'
import { useState } from 'react'
import 'https://xumm.app/assets/cdn/xumm-oauth2-pkce.min.js?v=2.7.1'

import { Network } from 'common/constants'
import { useStateContext } from 'components'

function AppHeader(): JSX.Element {
  const size = useContext(ResponsiveContext)
  const { network, updateNetwork } = useStateContext()
  const [XummClient, setXumm] = useState<typeof xumm | null>(null)
  const xumm = new XummPkce('c6f8ad59-180f-47c1-8c87-2eaf9b8cca26')

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
    
    xumm.on('success', async() => {
      const state = await xumm.state()
      console.log('state is', state)
      setXumm(xumm)
    })
    //xumm.authorize().catch((e) => console.log('e', e))

    // xumm.on("success", async () => {
    //   const state = await xumm.state() // state.sdk = instance of https://www.npmjs.com/package/xumm-sdk
    //   console.log("wallet id is ", state?.me?.sub)
    // })
  }

//Jing's try catch block
  // await client.connect()
  // if (wallet) {
  //   try {
  //     const metadataUri = `ipfs://${metadataCid}`
  //     const response = await mintNft(txFields, client, wallet, metadataUri, svgData)
  //     setTxResponse(response)
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (error: any) {
  //     window.alert(error.message)
  //   } finally {
  //     setLoading(false)
  //   }
  // }


  async function signOutXUMM(): Promise<void> {
    console.log('log out clicked!')
    try {
      xumm.logout()
    } catch (error: any) {
      console.log('Error message: ', error.message)
      window.alert(error.message)
    }
    
    xumm.on('success', async() => {
      const state = await xumm.state()
      console.log('state after logout is', state)
      setXumm(xumm)
    })
    //const state = await xumm.state()

    //console.log('state after logout is', state)

    setXumm(null)
  }

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
      <Button label="Logout" onClick={signOutXUMM} />
      </Box>
    </Header>
  )
}

export default AppHeader
