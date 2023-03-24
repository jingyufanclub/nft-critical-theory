import JSONPretty from 'react-json-pretty'
import { Box, Button, Form, FormField, Image, Page, PageHeader, Text } from 'grommet'
import { Client, TxResponse, Wallet, getNFTokenID } from 'xrpl'
import { useEffect, useState } from 'react'

import { Loading, useStateContext } from 'components'
import { TokenMetadata, TransactionFields } from 'common/entities'
import { formatDate, getJSON, mintNft, validateSeed } from 'common/utils'

import { en } from 'locales'

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
  const [nftId, setNftId] = useState<string | undefined>(undefined)

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
        if (response.result.meta && typeof response.result.meta !== 'string') {
          setNftId(getNFTokenID(response.result.meta))
        }
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
            <Button label="Mint" onClick={handleMint} disabled={!wallet || Boolean(txResponse)} />
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
              <Text>
                {en.mint.txId} {txResponse.result.hash}
              </Text>
              <Text>
                {en.mint.txDate} {formatDate(txResponse.result.date as number)}
              </Text>
              <Text>
                {en.mint.nftId} {nftId}
              </Text>
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
