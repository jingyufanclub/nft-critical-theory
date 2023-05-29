import {
  AccountNFTsResponse,
  Client,
  Transaction,
  TxResponse,
  Wallet,
  convertStringToHex,
  rippleTimeToISOTime,
} from 'xrpl'

import { XummJsonTransaction } from 'xumm-sdk/dist/src/types'
import { XummPkce } from 'xumm-oauth2-pkce'

import { MINT_BY_MEMO } from './constants'
import { TransactionFields } from 'common/entities'
import { en } from 'locales'

export interface XummTxResponse {
  success: boolean
  message: string
}

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

export async function buildTransaction(
  txFields: TransactionFields,
  client: Client,
  wallet: Wallet,
  metadataUri: string,
  svgData: string
) {
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

  return transaction
}

export async function mintNft(
  txFields: TransactionFields,
  client: Client,
  wallet: Wallet,
  metadataUri: string,
  svgData: string
): Promise<TxResponse> {
  const transaction: Transaction = await buildTransaction(txFields, client, wallet, metadataUri, svgData)

  const signedTx = wallet.sign(transaction)

  const txResponse = await client.submitAndWait(signedTx.tx_blob, { wallet })

  return txResponse
}

export async function mintXummNft(
  txFields: TransactionFields,
  metadataUri: string,
  svgData: string,
  xumm: XummPkce
): Promise<XummTxResponse> {
  const state = await xumm.state()
  const sdk = state?.sdk

  const transaction: XummJsonTransaction = {
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
    ],
  }

  try {
    const xummResponse = await sdk?.payload.createAndSubscribe(transaction, (event) => {
      return event.data.signed ? event.data : false
    })

    const resolveMint: any = await xummResponse?.resolved

    return resolveMint.signed
      ? {
          success: true,
          message: resolveMint.txid,
        }
      : {
          success: false,
          message: `${en.mint.xummReject}`,
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error.message
  }
}

export async function getNfts(client: Client, wallet: Wallet): Promise<AccountNFTsResponse> {
  const nfts = await client.request({
    command: 'account_nfts',
    account: wallet.address,
  })
  return nfts
}
