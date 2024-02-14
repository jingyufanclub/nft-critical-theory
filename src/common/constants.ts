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

export const DEFAULT_STYLE: CanvasStyle = {
  name: 'default',
  bgColor: 'black',
  fontFamily: 'Trebuchet MS, sans-serif',
  fontStyle: 'normal',
  fontColor: 'white',
  fontSize: 50,
  fontWeight: 400,
}

export const KRUGER_STYLE: CanvasStyle = {
  name: 'kruger',
  bgColor: 'red',
  fontFamily: 'Futura, Tahoma, sans-serif',
  fontStyle: 'oblique',
  fontColor: 'white',
  fontSize: 50,
  fontWeight: 800,
}

export const WEINER_STYLE: CanvasStyle = {
  name: 'weiner',
  bgColor: 'white',
  fontFamily: 'Arial Narrow, Arial, sans-serif',
  fontStyle: 'normal',
  fontColor: 'lime',
  fontStroke: 'mediumblue',
  fontSize: 60,
  fontWeight: 600,
}

export const CANVAS_STYLES: CanvasStyle[] = [DEFAULT_STYLE, KRUGER_STYLE, WEINER_STYLE]
