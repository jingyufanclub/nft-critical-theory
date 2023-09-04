export interface TokenMetadata {
  schema: string
  nftType: string
  name: string
  description: string
  image: string
  collection?: Collection
}

export interface Collection {
  name: string
}

export interface TransactionFields {
  flags: number
  transferFee: number
  taxon: number
}
