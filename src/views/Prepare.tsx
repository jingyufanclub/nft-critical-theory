import { Box, Button, Image, Page, PageContent, PageHeader } from 'grommet'
import { Client, Transaction, Wallet, convertStringToHex } from 'xrpl'
import { useEffect, useState } from 'react'

import { Networks } from 'common/constants'
import { useStateContext } from 'components'

import { en } from 'locales'

function Prepare(): JSX.Element {
  const { svgData } = useStateContext()
  const [client] = useState(new Client(Networks.TESTNET))

  async function connect() {
    await client.connect()
  }

  async function mintToken() {
    const wallet = Wallet.fromSeed('sEd7Xjd16Kup8V4en1wncxu8eQvYac2')
    console.log(wallet.address)

    const transaction: Transaction = await client.autofill({
      TransactionType: 'NFTokenMint',
      Account: wallet.address,
      URI: convertStringToHex('https://duncecapsforcats.com/'),
      Flags: 11,
      TransferFee: 10000,
      NFTokenTaxon: 1,
      Memos: [
        {
          Memo: {
            MemoData: convertStringToHex(svgData),
          },
        },
      ],
    })

    const signedTransaction = wallet.sign(transaction)

    const txn = await client.submitAndWait(signedTransaction.tx_blob, { wallet })
    const nfts = await client.request({
      command: 'account_nfts',
      account: wallet.address,
    })

    console.log(JSON.stringify(txn.result, null, 2))
    console.log(JSON.stringify(nfts, null, 2))
    client.disconnect()
  }

  useEffect(() => {
    connect()
  }, [])

  return (
    <Page>
      <PageContent>
        <PageHeader title={en.prepare.pageTitle} />
        <Box width={'50%'}>
          <Image src={svgData} />
        </Box>
        <Button label="Mint" onClick={mintToken} />
      </PageContent>
    </Page>
  )
}

export default Prepare
