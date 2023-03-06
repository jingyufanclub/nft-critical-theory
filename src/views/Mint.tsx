import JSONPretty from 'react-json-pretty'
import { Box, Button, Form, FormField, Image, Page, PageContent, PageHeader, Text } from 'grommet'
import { Client, TxResponse, Wallet, rippleTimeToISOTime } from 'xrpl'
import { useEffect, useState } from 'react'

import { Networks } from 'common/constants'
import { useStateContext } from 'components'
import { TokenMetadata, TransactionFields } from 'common/entities'
import { getJSON, mintNft } from 'common/utils'

import { en } from 'locales'

const defaultFields: TransactionFields = {
  walletSeed: '',
  flags: 11,
  transferFee: 10000,
  taxon: 0,
}

function Mint(): JSX.Element {
  const { svgData, metadataCid } = useStateContext()
  const [client] = useState<Client>(new Client(Networks.TESTNET))
  const [txFields, setTxFields] = useState<TransactionFields>(defaultFields)
  const [txResponse, setTxResponse] = useState<TxResponse | null>(null)
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(null)

  const wallet = txFields.walletSeed ? Wallet.fromSeed(txFields.walletSeed) : null

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

  async function handleMint() {
    if (wallet) {
      const metadataUri = `ipfs://${metadataCid}`
      const response = await mintNft(txFields, client, wallet, metadataUri, svgData)
      setTxResponse(response)
    }
  }

  useEffect(() => {
    connect()
    getMetadata()
    return () => {
      client.disconnect()
    }
  }, [])

  return (
    <Page>
      <PageContent>
        <PageHeader title={en.mint.pageTitle} />
        <Box direction="row" gap="xlarge" wrap>
          <Box width="medium" gap="medium">
            <Form
              value={txFields}
              onChange={(nextValue) => setTxFields(nextValue)}
              onReset={() => setTxFields(defaultFields)}
            >
              <FormField name="walletSeed" id="walletSeed" htmlFor="walletSeed" label={en.mint.walletSeed} required />
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
            {txResponse ? (
              <Box>
                <Text>
                  {en.mint.txId} {txResponse.result.hash}
                </Text>
                <Text>
                  {en.mint.txDate} {rippleTimeToISOTime(txResponse.result.date as number)}
                </Text>
              </Box>
            ) : (
              <Button label="Mint" onClick={handleMint} disabled={!txFields.walletSeed} />
            )}
          </Box>
          {tokenMetadata && (
            <Box width="medium">
              <Image src={tokenMetadata.image} />
              <JSONPretty data={tokenMetadata} />
            </Box>
          )}
        </Box>
      </PageContent>
    </Page>
  )
}

export default Mint
