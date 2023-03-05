export interface TokenMetadata {
  schema: string
  nftType: string
  name: string
  description: string
  image: string
}

export interface TransactionForm {
  walletSeed: string
  flags: number
  transferFee: number
  taxon: number
}
