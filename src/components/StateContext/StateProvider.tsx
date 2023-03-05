import { createContext, useContext, useState } from 'react'

type StateContextType = {
  metadataUri: string
  svgData: string
  text: string
  updateMetadataUri: (value: string) => void
  updateSvgData: (value: string) => void
  updateText: (value: string) => void
}

const defaultStateContext: StateContextType = {
  metadataUri: '',
  svgData: '',
  text: '',
  updateMetadataUri: () => {},
  updateSvgData: () => {},
  updateText: () => {},
}

const StateContext = createContext<StateContextType>(defaultStateContext)

function StateProvider({ children }: { children: JSX.Element }) {
  const [metadataUri, setMetadataUri] = useState<string>('')
  const [svgData, setSvg] = useState<string>('')
  const [text, setText] = useState<string>('')

  function updateMetadataUri(value: string): void {
    setMetadataUri(value)
  }

  function updateSvgData(value: string): void {
    setSvg(value)
  }

  function updateText(value: string): void {
    setText(value)
  }

  const value = {
    metadataUri,
    svgData,
    text,
    updateMetadataUri,
    updateSvgData,
    updateText,
  }

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}

export function useStateContext() {
  return useContext(StateContext)
}

export default StateProvider
