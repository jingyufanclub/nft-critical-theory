// import xrpl from 'xrpl'
import { useEffect } from 'react'
import { Page, PageContent, PageHeader } from 'grommet'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const xrpl = require('xrpl')

function Mint(): JSX.Element {
  async function connect() {
    console.log('connecting...')
    // Define the network client
    const client = new xrpl.Client('wss://xrplcluster.com/')
    await client.connect()
    const response = await client.request({
      command: 'account_info',
      account: 'rptqJUekfNpj8nRfp5oVkT6p9qo8vNFsq5',
      ledger_index: 'validated',
    })
    console.log(response)
    if (response) {
      client.disconnect()
    }
  }

  useEffect(() => {
    connect()
  }, [])

  return (
    <Page>
      <PageContent>
        <PageHeader title="NFT Critical Theory" />
      </PageContent>
    </Page>
  )
}

export default Mint
