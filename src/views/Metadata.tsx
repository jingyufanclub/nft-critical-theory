import JSONPretty from 'react-json-pretty'
import { Blob, NFTStorage } from 'nft.storage'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Image, Page, PageContent, PageHeader, TextArea, TextInput } from 'grommet'
import { useEffect, useState } from 'react'

import { TokenMetadata } from 'common/entities'
import { useStateContext } from 'components'
import { NFT_TYPE, SCHEMA_STRING } from 'common/constants'

import { en } from 'locales'

const defaultMetadata: TokenMetadata = {
  schema: SCHEMA_STRING,
  nftType: NFT_TYPE,
  name: '',
  description: '',
  image: new Blob(),
}

function Metadata(): JSX.Element {
  const navigate = useNavigate()
  const { svgData, text, updateMetadata } = useStateContext()
  const [metadata, setMetadata] = useState<TokenMetadata>(defaultMetadata)

  const metadataString = JSON.stringify(metadata)

  // const nftStorageClient = new NFTStorage({
  //   token,
  // })

  // async function handleUploadToStorage() {
  //   const result = await nftStorageClient.store(metadata)
  //   console.log(result.data, result.url)
  // }

  function handleEditName(name: string): void {
    setMetadata({ ...metadata, name })
  }

  function handleEditDescription(description: string): void {
    setMetadata({ ...metadata, description })
  }

  function handleNavigate(): void {
    updateMetadata(metadataString)
    navigate('/prepare')
  }

  useEffect(() => {
    setMetadata({
      ...metadata,
      name: text,
      image: new Blob([svgData]),
    })
  }, [])

  return (
    <Page>
      <PageContent>
        <PageHeader title={en.metadata.pageTitle} />
        <Box direction="row" gap="xlarge" wrap>
          <Box width="medium" gap="medium">
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
            <Box align="center">
              <Box width="small">
                <Button label={en.draw.navigateButton} onClick={handleNavigate} />
              </Box>
            </Box>
          </Box>
          <Box width="medium">
            <JSONPretty data={metadata} />
            <Image src={svgData} />
          </Box>
        </Box>
      </PageContent>
    </Page>
  )
}

export default Metadata
