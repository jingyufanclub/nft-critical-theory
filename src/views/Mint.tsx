import JSONPretty from 'react-json-pretty'
import { Box, Button, Form, FormField, Image, Page, PageHeader, Text } from 'grommet'
import { Client, TxResponse, Wallet } from 'xrpl'
import { useEffect, useState } from 'react'

import { Loading, useStateContext } from 'components'
import { TokenMetadata, TransactionFields } from 'common/entities'
import { formatDate, getJSON, mintNft, mintXummNft, validateSeed } from 'common/utils'

import { en } from 'locales'

import { XummPkce } from 'xumm-oauth2-pkce'

const defaultFields: TransactionFields = {
  walletSeed: '',
  flags: 11,
  transferFee: 10000,
  taxon: 0,
}

function Mint(): JSX.Element {
  const { metadataCid, network, svgData } = useStateContext()
  const [txFields, setTxFields] = useState<TransactionFields>(defaultFields)
  const [txResponse, setTxResponse] = useState<TxResponse | null>(null)
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(null)
  const [client, setClient] = useState<Client>(new Client(network))
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const xumm = new XummPkce('c6f8ad59-180f-47c1-8c87-2eaf9b8cca26')
  const [isConnected, setIsConnected] = useState(false)


  async function getMetadata(): Promise<void> {
    try {
      const metadata = await getJSON(`https://${metadataCid}.ipfs.nftstorage.link`)
      setTokenMetadata(metadata)
    } catch (error) {
      console.error(error)
    }
  }

  function getWallet(): void {
    if (validateSeed(txFields.walletSeed)) {
      try {
        const wallet = Wallet.fromSeed(txFields.walletSeed)
        setWallet(wallet)
      } catch (error) {
        console.error(error)
      }
    }
  }

  async function handleMint(): Promise<void> {
    setLoading(true)
    await client.connect()
    if (wallet) {
      try {
        const metadataUri = `ipfs://${metadataCid}`
        const response = await mintNft(txFields, client, wallet, metadataUri, svgData)
        setTxResponse(response)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        window.alert(error.message)
      } finally {
        setLoading(false)
      }
    }
    client.disconnect()
  }

  async function handleXummMint(): Promise<void> {
    setLoading(true)
    await client.connect()
    if (isConnected) {
      try {
        const metadataUri = `ipfs://${metadataCid}`
        const xummResponse = await mintXummNft(txFields, client, metadataUri, svgData, xumm)
        //setTxResponse(xummResponse)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        window.alert(error.message)
      } finally {
        setLoading(false)
      }
    }
    client.disconnect()
  }

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

  useEffect(() => {
    xumm.on('success', async () => {
      console.log('success detected')

      const state = await xumm.state()
      const sdk = state?.sdk
      console.log('state is', state)
      console.log('sdk is ', sdk)
      setIsConnected(true)
    })

    console.log('xumm.on set up once')

    return () => {
      xumm.off('success', async () => {
        console.log('Using xumm.off to turn off xumm.on from useEffect')
      })
    }
  }, [])



  useEffect(() => {
    setClient(new Client(network))
  }, [network])

  useEffect(() => {
    getWallet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txFields.walletSeed])

  useEffect(() => {
    getMetadata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Page>
      <PageHeader title={en.mint.pageTitle} />
      <Box direction="row" gap="xlarge" wrap>
        <Box width="medium" gap="medium" margin={{ bottom: 'medium' }}>
          <Form
            value={txFields}
            onChange={(nextValue) => setTxFields(nextValue)}
            onReset={() => setTxFields(defaultFields)}
          >
            <FormField
              name="walletSeed"
              id="walletSeed"
              htmlFor="walletSeed"
              label={en.mint.walletSeed}
              info={en.mint.walletSeedInfo}
              required
            />
            <FormField
              name="flags"
              id="flags"
              htmlFor="flags"
              label={en.mint.flags}
              info={en.mint.flagsInfo}
              required
            />
            <FormField
              name="transferFee"
              id="transferFee"
              htmlFor="transferFee"
              label={en.mint.transferFee}
              info={en.mint.transferFeeInfo}
              required
            />
            <FormField
              name="taxon"
              id="taxon"
              htmlFor="taxon"
              label={en.mint.taxon}
              info={en.mint.taxonInfo}
              required
            />
          </Form>
          <Box gap="medium">
            <Button label="Mint" onClick={handleMint} disabled={!wallet || !!txResponse} />

            <Button label="Connect XUMM" onClick={signIntoXUMM} />
            <Button label="Logout" onClick={signOutXUMM} disabled={!isConnected} />
            <Button label="Mint With Xumm" onClick={handleXummMint} disabled={!isConnected || !!txResponse} />
          </Box>
        </Box>
        <Box width="medium" gap="medium" margin={{ bottom: 'medium' }}>
          {wallet && (
            <Text>
              {en.mint.walletAddress} {wallet.address}
            </Text>
          )}
          {txResponse && (
            <Box>
              <Text>{en.mint.success}</Text>
              <Text>
                {en.mint.txId}: {txResponse.result.hash}
              </Text>
              <Text>
                {en.mint.txDate}: {formatDate(txResponse.result.date as number)}
              </Text>
            </Box>
          )}
          {txResponse && (
            <Box gap="medium">
              <Button label="Make another NFT!" />
            </Box>
          )}
          {tokenMetadata && (
            <Box>
              <Box border>
                <Image src={tokenMetadata.image} />
              </Box>
              <JSONPretty data={tokenMetadata} />
            </Box>
          )}
        </Box>
      </Box>

      {loading && <Loading />}
    </Page>
  )
}

export default Mint
