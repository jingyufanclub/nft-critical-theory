import { CanvasStyle } from './entities'

export const SCHEMA_STRING = 'ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU'

export const NFT_TYPE = 'art.v0'

export const MINT_BY_MEMO = 'NFTokenMint by not-a-rug-pull.xyz'

export enum Network {
  DEVNET = 'wss://s.devnet.rippletest.net:51233/',
  MAINNET = 'wss://xrplcluster.com/',
  TESTNET = 'wss://s.altnet.rippletest.net:51233/',
}

export const bithompBaseUrl = {
  [Network.DEVNET]: 'https://dev.bithomp.com',
  [Network.MAINNET]: 'https://bithomp.com',
  [Network.TESTNET]: 'https://test.bithomp.com',
}

export const KRUGER_STYLE: CanvasStyle = {
  name: 'kruger',
  bgColor: 'red',
  fontFamily: 'Futura,Trebuchet MS,Arial,sans-serif',
  fontStyle: 'oblique',
  fontColor: 'white',
}

export const DEFAULT_STYLE: CanvasStyle = {
  name: 'default',
  bgColor: 'black',
  fontFamily: 'Trebuchet MS, sans-serif',
  fontStyle: 'normal',
  fontColor: 'white',
}
