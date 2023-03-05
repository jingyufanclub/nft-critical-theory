import { Box, Button, Form, FormField, Image, Page, PageContent, PageHeader, TextInput } from 'grommet'
import { Client, Transaction, Wallet, convertStringToHex } from 'xrpl'
import { useEffect, useState } from 'react'

import { Networks } from 'common/constants'
import { TransactionForm } from 'common/entities'
import { useStateContext } from 'components'

import { en } from 'locales'

const defaultForm: TransactionForm = {
  walletSeed: '',
  flags: 0,
  transferFee: 10000,
  taxon: 0,
}

function Prepare(): JSX.Element {
  const { svgData, metadataUri } = useStateContext()
  const [client] = useState(new Client(Networks.TESTNET))
  const [form, setForm] = useState<TransactionForm>(defaultForm)
  console.log(svgData, metadataUri)
  console.log(form)
  async function connect() {
    await client.connect()
  }

  async function mintToken() {
    const wallet = Wallet.fromSeed(form.walletSeed)
    console.log(wallet.address)

    const transaction: Transaction = await client.autofill({
      TransactionType: 'NFTokenMint',
      Account: wallet.address,
      URI: convertStringToHex(metadataUri),
      Flags: form.flags,
      TransferFee: form.transferFee,
      NFTokenTaxon: form.taxon,
      Memos: [
        {
          Memo: {
            MemoData: convertStringToHex(svgData),
          },
        },
      ],
    })
    console.log(JSON.stringify(transaction, null, 2))
    // const signedTransaction = wallet.sign(transaction)

    // const txn = await client.submitAndWait(signedTransaction.tx_blob, { wallet })
    // const nfts = await client.request({
    //   command: 'account_nfts',
    //   account: wallet.address,
    // })

    // console.log(JSON.stringify(txn.result, null, 2))
    // console.log(JSON.stringify(nfts, null, 2))
    // client.disconnect()
  }

  useEffect(() => {
    connect()
  }, [])

  return (
    <Page>
      <PageContent>
        <PageHeader title={en.prepare.pageTitle} />
        <Form value={form} onChange={(nextValue) => setForm(nextValue)} onReset={() => setForm(defaultForm)}>
          <FormField name="walletSeed" htmlFor="wallet-seed" label={en.prepare.walletSeed}>
            <TextInput id="wallet-seed" name="walletSeed" />
          </FormField>
          <FormField name="flags" htmlFor="flags" label={en.prepare.flags}>
            <TextInput id="flags" name="flags" />
          </FormField>
          <FormField name="transferFee" htmlFor="transfer-fee" label={en.prepare.transferFee}>
            <TextInput id="transfer-fee" name="transferFee" />
          </FormField>
          <FormField name="taxon" htmlFor="taxon" label={en.prepare.taxon}>
            <TextInput id="taxon" name="taxon" />
          </FormField>
        </Form>
        <Box width={'50%'}>
          <Image src={svgData} />
        </Box>
        <Button label="Mint" onClick={mintToken} />
      </PageContent>
    </Page>
  )
}

export default Prepare
