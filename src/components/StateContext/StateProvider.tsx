import { createContext, useContext, useEffect, useState } from 'react'

import { CanvasStyle } from 'common/entities'
import { DEFAULT_STYLE, Network } from 'common/constants'
import { ResolvedFlow, XummPkce } from 'xumm-oauth2-pkce'

type StateContextType = {
  metadataCid: string
  svgData: string
  text: string
  canvasStyle: CanvasStyle
  network: Network
  xumm: XummPkce
  isXummConnected: boolean
  me: ResolvedFlow['me'] | null
  updateMetadataCid: (value: string) => void
  updateNetwork: (value: Network) => void
  updateSvgData: (value: string) => void
  updateText: (value: string) => void
  updateIsXummConnected: (value: boolean) => void
  updateCanvasStyle: (value: CanvasStyle) => void
}

const defaultStateContext: StateContextType = {
  metadataCid: '',
  svgData: '',
  text: '',
  canvasStyle: DEFAULT_STYLE,
  network: Network.TESTNET,
  xumm: new XummPkce('c6f8ad59-180f-47c1-8c87-2eaf9b8cca26'),
  isXummConnected: false,
  me: null,
  updateMetadataCid: () => {},
  updateNetwork: () => {},
  updateSvgData: () => {},
  updateText: () => {},
  updateIsXummConnected: () => {},
  updateCanvasStyle: () => {},
}

export type ExtendedResolvedFlow = ResolvedFlow & {
  me: {
    networkType: keyof typeof Network
  }
}

const StateContext = createContext<StateContextType>(defaultStateContext)

function StateProvider({ children }: { children: JSX.Element }) {
  const [metadataCid, setMetadataCid] = useState<string>('')
  const [network, setNetwork] = useState<Network>(Network.TESTNET)
  const [svgData, setSvg] = useState<string>('')
  const [text, setText] = useState<string>('')
  const [canvasStyle, setCanvasStyle] = useState<CanvasStyle>(DEFAULT_STYLE)
  const [xumm] = useState<XummPkce>(new XummPkce('c6f8ad59-180f-47c1-8c87-2eaf9b8cca26'))
  const [isXummConnected, setIsXummConnected] = useState<boolean>(false)
  const [me, setMe] = useState<ExtendedResolvedFlow['me'] | null>(null)

  useEffect(() => {
    getMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isXummConnected])

  async function getMe(): Promise<void> {
    if (isXummConnected) {
      const xummRes = (await xumm.state()) as ExtendedResolvedFlow
      if (xummRes) {
        setNetwork(Network[xummRes.me.networkType])
        setMe(xummRes.me)
      }
    }
  }

  function updateMetadataCid(value: string): void {
    setMetadataCid(value)
  }

  function updateNetwork(value: Network): void {
    setNetwork(value)
  }

  function updateSvgData(value: string): void {
    setSvg(value)
  }

  function updateText(value: string): void {
    setText(value)
  }

  function updateIsXummConnected(value: boolean): void {
    setIsXummConnected(value)
  }

  function updateCanvasStyle(value: CanvasStyle): void {
    setCanvasStyle(value)
  }

  const value = {
    metadataCid,
    network,
    svgData,
    text,
    canvasStyle,
    xumm,
    isXummConnected,
    me,
    updateMetadataCid,
    updateNetwork,
    updateSvgData,
    updateText,
    updateCanvasStyle,
    updateIsXummConnected,
  }

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}

export function useStateContext() {
  return useContext(StateContext)
}

export default StateProvider
