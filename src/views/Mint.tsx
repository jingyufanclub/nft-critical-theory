import JSONPretty from 'react-json-pretty'
import { Box, Button, Form, FormField, Image, Page, PageHeader, Text } from 'grommet'
import { Client, TxResponse, Wallet, getNFTokenID } from 'xrpl'
import { useEffect, useState } from 'react'

import { Loading, useStateContext } from 'components'
import { TokenMetadata, TransactionFields } from 'common/entities'
import { XummTxResponse, formatDate, getJSON, mintNft, mintXummNft, validateSeed } from 'common/utils'

import { en } from 'locales'

const defaultFields: TransactionFields = {
  walletSeed: '',
  flags: 11,
  transferFee: 10000,
  taxon: 0,
}

function Mint(): JSX.Element {
  const { metadataCid, network, svgData, xumm, isXummConnected } = useStateContext()
  const [txFields, setTxFields] = useState<TransactionFields>(defaultFields)
  const [txResponse, setTxResponse] = useState<TxResponse | null>(null)
  const [xummTxResponse, setXummTxResponse] = useState<XummTxResponse>()
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
    const metadataUri = `ipfs://${metadataCid}`
    try {
      if (isXummConnected) {
        const xummResponse = await mintXummNft(txFields, metadataUri, svgData, xumm)
        return setXummTxResponse(xummResponse)
      }

      if (wallet) {
        const response = await mintNft(txFields, client, wallet, metadataUri, svgData)
        if (response.result.meta && typeof response.result.meta !== 'string') {
          setNftId(getNFTokenID(response.result.meta))
        }
        return setTxResponse(response)
      }
    } catch (error) {
      if (error instanceof Error) {
        window.alert(error.message)
      }
    } finally {
      setLoading(false)
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
            {!isXummConnected && (
              <FormField
                name="walletSeed"
                id="walletSeed"
                htmlFor="walletSeed"
                label={en.mint.walletSeed}
                info={en.mint.walletSeedInfo}
                required
              />
            )}
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
            <Button label="Mint" onClick={handleMint} />
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
              <Text>
                {en.mint.nftId} {nftId}
              </Text>
            </Box>
          )}
          {txResponse && (
            <Box gap="medium">
              <Button label="Make another NFT!" />
            </Box>
          )}
          {xummTxResponse?.success ? (
            <Box>
              <Text>{en.mint.xummSuccess}</Text>
              <Text>
                {en.mint.txId}: {xummTxResponse.message}
              </Text>
            </Box>
          ) : (
            <Box>
              <Text>{xummTxResponse?.message}</Text>
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
