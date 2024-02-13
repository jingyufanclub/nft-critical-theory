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

export type CanvasStyleName = 'default' | 'kruger'

export interface CanvasStyle {
  name: CanvasStyleName
  bgColor: string
  fontFamily: string
  fontStyle: string
  fontColor: string
}
