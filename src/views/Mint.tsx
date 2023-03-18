import JSONPretty from 'react-json-pretty'
import { Box, Button, Form, FormField, Image, Page, PageContent, PageHeader, Text } from 'grommet'
import { TxResponse, Wallet } from 'xrpl'
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
  const { client, metadataCid, svgData } = useStateContext()
  const [txFields, setTxFields] = useState<TransactionFields>(defaultFields)
  const [txResponse, setTxResponse] = useState<TxResponse | null>(null)
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(null)
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  async function connect() {
    await client.connect()
  }

  async function getMetadata() {
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

  async function handleMint() {
    if (wallet) {
      setLoading(true)
      const metadataUri = `ipfs://${metadataCid}`
      const response = await mintNft(txFields, client, wallet, metadataUri, svgData)
      setTxResponse(response)
    }
  }

  useEffect(() => {
    getWallet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txFields.walletSeed])

  useEffect(() => {
    if (txResponse) {
      setLoading(false)
    }
  }, [txResponse])

  useEffect(() => {
    connect()
    return () => {
      client.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  useEffect(() => {
    getMetadata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Page height="100%">
      <PageContent>
        <PageHeader title={en.mint.pageTitle} />
        <Box direction="row" gap="xlarge" wrap>
          <Box width="medium" gap="medium">
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
            </Box>
          </Box>
          <Box width="medium">
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
              </Box>
            )}
            {tokenMetadata && (
              <Box>
                <Image src={tokenMetadata.image} />
                <JSONPretty data={tokenMetadata} />
              </Box>
            )}
          </Box>
        </Box>
      </PageContent>
      {loading && <Loading />}
    </Page>
  )
}

export default Mint
