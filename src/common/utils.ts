import {
  AccountNFTsResponse,
  Client,
  Transaction,
  TxResponse,
  Wallet,
  convertStringToHex,
  rippleTimeToISOTime,
} from 'xrpl'

import { XummPkce } from 'xumm-oauth2-pkce'

import { MINT_BY_MEMO } from './constants'
import { TransactionFields } from 'common/entities'
import { XummJsonTransaction } from 'xumm-sdk/dist/src/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getJSON(url: string): Promise<any> {
  const response = await fetch(url)
  if (response.ok) return response.json()
  throw new Error(response.statusText)
}

export function validateSeed(walletSeed: string): boolean {
  const regex = /^s[a-zA-Z0-9]{12,}$/
  return regex.test(walletSeed)
}

export function formatDate(date: number): string {
  const iso = rippleTimeToISOTime(date)
  return new Date(iso).toString()
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
          MemoData: convertStringToHex(MINT_BY_MEMO),
        },
      },
      {
        Memo: {
          MemoData: convertStringToHex(svgData),
        },
      },
    ],
  })

  console.log("transaction object is ", transaction)

  const signedTx = wallet.sign(transaction)

  const txResponse = await client.submitAndWait(signedTx.tx_blob, { wallet })

  return txResponse
}

export async function mintXummNft(
  txFields: TransactionFields,
  client: Client,
  metadataUri: string,
  svgData: string,
  xumm: XummPkce
): Promise<null> {

  const state = await xumm.state()
  const sdk = state?.sdk

  const request: XummJsonTransaction = {
    TransactionType: 'NFTokenMint',
    URI: convertStringToHex(metadataUri),
    Flags: Number(txFields.flags),
    TransferFee: Number(txFields.transferFee),
    NFTokenTaxon: Number(txFields.taxon),
    Memos: [
      {
        Memo: {
          MemoData: convertStringToHex(MINT_BY_MEMO),
        },
      },
      {
        Memo: {
          MemoData: convertStringToHex(svgData),
        },
      },
    ]
  }

  const xummResponse = await sdk?.payload.createAndSubscribe(request, event => {
    console.log('New payload event: ', event.data)

    if (event.data.signed === true) {
      // No need to console.log here, we'll do that below
      return event.data
    }

    if (event.data.signed === false) {
      // No need to console.log here, we'll do that below
      return false
    }
  })

  console.log(xummResponse?.created)
  console.log('Returned tx from xumm: ', xummResponse)

  const resolveMint = await xummResponse?.resolved

  console.log('Resolved: ', resolveMint)

  if (resolveMint?.signed === false) {
    console.log('The sign request was rejected :(')
  }

  if (resolveMint?.signed === true) {
    console.log('Woohoo! The sign request was signed :)')
  } 
  return null
}

export async function getNfts(client: Client, wallet: Wallet): Promise<AccountNFTsResponse> {
  const nfts = await client.request({
    command: 'account_nfts',
    account: wallet.address,
  })
  return nfts
}
