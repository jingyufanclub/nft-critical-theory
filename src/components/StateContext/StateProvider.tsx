import { createContext, useContext, useState } from 'react'

type StateContextType = {
  metadataCid: string
  svgData: string
  text: string
  updateMetadataCid: (value: string) => void
  updateSvgData: (value: string) => void
  updateText: (value: string) => void
}

const defaultStateContext: StateContextType = {
  metadataCid: '',
  svgData: '',
  text: '',
  updateMetadataCid: () => {},
  updateSvgData: () => {},
  updateText: () => {},
}

const StateContext = createContext<StateContextType>(defaultStateContext)

function StateProvider({ children }: { children: JSX.Element }) {
  const [metadataCid, setMetadataCid] = useState<string>('')
  const [svgData, setSvg] = useState<string>('')
  const [text, setText] = useState<string>('')

  function updateMetadataCid(value: string): void {
    setMetadataCid(value)
  }

  function updateSvgData(value: string): void {
    setSvg(value)
  }

  function updateText(value: string): void {
    setText(value)
  }

  const value = {
    metadataCid,
    svgData,
    text,
    updateMetadataCid,
    updateSvgData,
    updateText,
  }

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}

export function useStateContext() {
  return useContext(StateContext)
}

export default StateProvider
