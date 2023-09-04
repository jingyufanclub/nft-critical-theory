import JSONPretty from 'react-json-pretty'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Form, FormField, Image, Page, PageHeader, Paragraph, Text, TextInput } from 'grommet'
import { Client, TxResponse, Wallet } from 'xrpl'
import { Hide, ShareRounded, View } from 'grommet-icons'
import { useEffect, useState } from 'react'

import { bithompBaseUrl } from 'common/constants'
import { AnchorLink, Loading, useStateContext } from 'components'
import { TokenMetadata, TransactionFields } from 'common/entities'
import { XummTxResponse, getJSON, mintNft, mintXummNft, validateSeed } from 'common/utils'

import { en } from 'locales'

const defaultFields: TransactionFields = {
  flags: 11,
  transferFee: 10000,
  taxon: 0,
}

function Mint(): JSX.Element {
  const { metadataCid, network, svgData, xumm, isXummConnected } = useStateContext()
  const [txFields, setTxFields] = useState<TransactionFields>(defaultFields)
  const [txResponse, setTxResponse] = useState<TxResponse | null>(null)
  const [xummTxResponse, setXummTxResponse] = useState<XummTxResponse>()
  const [walletSeed, setWalletSeed] = useState<string>(localStorage.getItem(`${network}-walletSeed`) || '')
  const [reveal, setReveal] = useState<boolean>(false)
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(null)
  const [client, setClient] = useState<Client>(new Client(network))
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  async function getMetadata(): Promise<void> {
    try {
      const metadata = await getJSON(`https://${metadataCid}.ipfs.nftstorage.link`)
      setTokenMetadata(metadata)
    } catch (error) {
      console.error(error)
    }
  }

  function handleWalletSeed(key: string): void {
    if (validateSeed(key)) {
      setWalletSeed(key)
      localStorage.setItem(`${network}-walletSeed`, key)
    }
  }

  function getWallet(): void {
    if (validateSeed(walletSeed)) {
      try {
        const wallet = Wallet.fromSeed(walletSeed)
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

  function handleNavigate(): void {
    navigate('/draw')
  }

  useEffect(() => {
    setClient(new Client(network))
  }, [network])

  useEffect(() => {
    const localWalletSeed = localStorage.getItem(`${network}-walletSeed`)
    if (localWalletSeed !== null) {
      setWalletSeed(localWalletSeed)
      getWallet()
    } else {
      setWalletSeed('')
      setWallet(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network])

  useEffect(() => {
    getMetadata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Page>
      <PageHeader title={en.mint.pageTitle} />
      <Box direction="row" gap="xlarge" wrap>
        <Box width="medium" gap="medium" margin={{ bottom: 'medium' }}>
          {!isXummConnected && (
            <Box width="medium" direction="row" gap="small" align="center" round="4px">
              <TextInput
                value={walletSeed}
                onChange={(event) => handleWalletSeed(event.target.value)}
                placeholder={en.mint.walletSeedInfo}
                type={reveal ? 'text' : 'password'}
              />
              <Button
                plain
                a11yTitle={reveal ? en.metadata.hideKey : en.metadata.revealKey}
                icon={reveal ? <Hide /> : <View />}
                onClick={() => setReveal(!reveal)}
              />
            </Box>
          )}
          <Form
            value={txFields}
            onChange={(nextValue) => setTxFields(nextValue)}
            onReset={() => setTxFields(defaultFields)}
          >
            <Paragraph>{en.mint.instructions2}</Paragraph>
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
            <Box direction="column">
              <Text>{en.mint.success}</Text>
              <Box direction="row" align="center" gap="xsmall">
                <AnchorLink
                  to={`${bithompBaseUrl[network]}/explorer/${txResponse.result.hash}`}
                  label={en.mint.successView}
                  target="_blank"
                />
                <ShareRounded color="brand" size="small" />
              </Box>
            </Box>
          )}
          {txResponse && (
            <Box gap="medium">
              <Button label={en.mint.newMint} onClick={handleNavigate} />
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
