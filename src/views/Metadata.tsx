import JSONPretty from 'react-json-pretty'
import { useNavigate } from 'react-router-dom'
import { Blob, NFTStorage } from 'nft.storage'
import { Box, Button, Page, PageHeader, TextArea, TextInput } from 'grommet'
import { Hide, View } from 'grommet-icons'
import { useEffect, useState } from 'react'

import { TokenMetadata } from 'common/entities'
import { Loading, useStateContext } from 'components'
import { NFT_TYPE, SCHEMA_STRING } from 'common/constants'

import { en } from 'locales'

const defaultMetadata: TokenMetadata = {
  schema: SCHEMA_STRING,
  nftType: NFT_TYPE,
  name: '',
  description: '',
  image: '',
}

function Metadata(): JSX.Element {
  const navigate = useNavigate()
  const { svgData, text, metadataCid, updateMetadataCid } = useStateContext()
  const [metadata, setMetadata] = useState<TokenMetadata>(defaultMetadata)
  const [nftStorageKey, setNftStorageKey] = useState<string>('')
  const [reveal, setReveal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  function handleEditName(name: string): void {
    setMetadata({ ...metadata, name })
  }

  function handleEditDescription(description: string): void {
    setMetadata({ ...metadata, description })
  }

  function handleAddCollection(name: string): void {
    if (name) {
      setMetadata({ ...metadata, collection: { name } })
    } else {
      setMetadata({ ...metadata, collection: undefined })
    }
  }

  function handleApiKey(key: string): void {
    setNftStorageKey(key)
  }

  async function handleUpload(): Promise<void> {
    setLoading(true)
    try {
      const nftStorageClient = new NFTStorage({
        token: nftStorageKey,
      })
      const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' })
      const cid = await nftStorageClient.storeBlob(blob)
      updateMetadataCid(cid)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      window.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleNavigate(): void {
    navigate('/mint')
  }

  useEffect(() => {
    setMetadata({
      ...metadata,
      name: text,
      image: svgData,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Page>
      <PageHeader title={en.metadata.pageTitle} />
      <Box direction="row" gap="xlarge" wrap>
        <Box width="medium" gap="medium" margin={{ bottom: 'medium' }}>
          <TextInput
            value={metadata.name}
            onChange={(event) => handleEditName(event.target.value)}
            placeholder={en.metadata.editName}
          />
          <TextArea
            value={metadata.description}
            onChange={(event) => handleEditDescription(event.target.value)}
            placeholder={en.metadata.editDescription}
          />
          <TextInput
            value={metadata.collection?.name || ''}
            onChange={(event) => handleAddCollection(event.target.value)}
            placeholder={en.metadata.addCollection}
          />
          <Box width="medium" direction="row" gap="small" align="center" round="4px">
            <TextInput
              value={nftStorageKey}
              onChange={(event) => handleApiKey(event.target.value)}
              placeholder={en.metadata.addApiKey}
              type={reveal ? 'text' : 'password'}
            />
            <Button
              plain
              a11yTitle={reveal ? en.metadata.hideKey : en.metadata.revealKey}
              icon={reveal ? <Hide /> : <View />}
              onClick={() => setReveal(!reveal)}
            />
          </Box>
          <Box align="center">
            <Button
              label={en.metadata.uploadMetadata}
              onClick={handleUpload}
              disabled={!nftStorageKey || Boolean(metadataCid)}
            />
          </Box>
        </Box>
        <Box width="medium" gap="medium" margin={{ bottom: 'medium' }}>
          <JSONPretty data={metadata} />
          <Box align="center">
            <Button label={en.metadata.navigateButton} onClick={handleNavigate} disabled={!metadataCid} />
          </Box>
        </Box>
      </Box>
      {loading && <Loading />}
    </Page>
  )
}

export default Metadata
