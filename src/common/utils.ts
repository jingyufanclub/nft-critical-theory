import { AccountNFTsResponse, Client, Transaction, TxResponse, Wallet, convertStringToHex } from 'xrpl'

import { TransactionFields } from 'common/entities'

export async function getJSON(url: string): Promise<any> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(response.statusText)
  return response.json()
}

export async function mintNft(
  txFields: TransactionFields,
  client: Client,
  wallet: Wallet,
  metadataUri: string,
  svgData: string
): Promise<TxResponse> {
  const transaction: Transaction = await client.autofill({
    TransactionType: 'NFTokenMint',
    Account: wallet.address,
    URI: convertStringToHex(metadataUri),
    Flags: Number(txFields.flags),
    TransferFee: Number(txFields.transferFee),
    NFTokenTaxon: Number(txFields.taxon),
    Memos: [
      {
        Memo: {
          MemoData: convertStringToHex(svgData),
        },
      },
    ],
  })

  const signedTx = wallet.sign(transaction)

  const txResponse = await client.submitAndWait(signedTx.tx_blob, { wallet })

  return txResponse
}

export async function getNfts(client: Client, wallet: Wallet): Promise<AccountNFTsResponse> {
  const nfts = await client.request({
    command: 'account_nfts',
    account: wallet.address,
  })
  return nfts
}
