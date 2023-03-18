import { Client } from 'xrpl'
import { createContext, useContext, useEffect, useState } from 'react'

import { Network } from 'common/constants'

type StateContextType = {
  client: Client
  metadataCid: string
  svgData: string
  text: string
  network: Network
  updateMetadataCid: (value: string) => void
  updateNetwork: (value: Network) => void
  updateSvgData: (value: string) => void
  updateText: (value: string) => void
}

const defaultStateContext: StateContextType = {
  client: new Client(Network.TESTNET),
  metadataCid: '',
  svgData: '',
  text: '',
  network: Network.TESTNET,
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
  const [client, setClient] = useState<Client>(new Client(Network.TESTNET))

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

  const value = {
    client,
    metadataCid,
    network,
    svgData,
    text,
    updateMetadataCid,
    updateNetwork,
    updateSvgData,
    updateText,
  }

  useEffect(() => {
    setClient(new Client(network))
  }, [network])

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}

export function useStateContext() {
  return useContext(StateContext)
}

export default StateProvider
