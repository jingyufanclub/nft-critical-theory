import { createContext, useContext, useState } from 'react'

import { Network } from 'common/constants'
import { XummPkce } from 'xumm-oauth2-pkce'

type StateContextType = {
  metadataCid: string
  svgData: string
  text: string
  network: Network
  xummState: XummPkce | undefined
  updateMetadataCid: (value: string) => void
  updateNetwork: (value: Network) => void
  updateSvgData: (value: string) => void
  updateText: (value: string) => void
}

const defaultStateContext: StateContextType = {
  metadataCid: '',
  svgData: '',
  text: '',
  network: Network.TESTNET,
  xummState: undefined,
  updateMetadataCid: () => {},
  updateNetwork: () => {},
  updateSvgData: () => {},
  updateText: () => {},
}

const StateContext = createContext<StateContextType>(defaultStateContext)

function StateProvider({ children }: { children: JSX.Element }) {
  const [metadataCid, setMetadataCid] = useState<string>('')
  const [network, setNetwork] = useState<Network>(Network.TESTNET)
  const [svgData, setSvg] = useState<string>('')
  const [text, setText] = useState<string>('')
  const [xummState, setXummState] = useState<XummPkce>()

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

  function updateXummState(value: XummPkce): void {
    setXummState(value)
  }

  const value = {
    metadataCid,
    network,
    svgData,
    text,
    xummState,
    updateMetadataCid,
    updateNetwork,
    updateSvgData,
    updateText,
    updateXummState,
  }

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}

export function useStateContext() {
  return useContext(StateContext)
}

export default StateProvider
