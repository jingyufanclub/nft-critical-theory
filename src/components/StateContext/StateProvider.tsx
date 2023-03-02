import { createContext, useContext, useState } from 'react'

type StateContextType = {
  metadata: string
  svgData: string
  text: string
  updateMetadata: (value: string) => void
  updateSvgData: (value: string) => void
  updateText: (value: string) => void
}

const defaultStateContext: StateContextType = {
  metadata: '',
  svgData: '',
  text: '',
  updateMetadata: () => {},
  updateSvgData: () => {},
  updateText: () => {},
}

const StateContext = createContext<StateContextType>(defaultStateContext)

function StateProvider({ children }: { children: JSX.Element }) {
  const [metadata, setMetadata] = useState<string>('')
  const [svgData, setSvgData] = useState<string>('')
  const [text, setText] = useState<string>('')

  function updateMetadata(value: string): void {
    setMetadata(value)
  }

  function updateSvgData(value: string): void {
    setSvgData(value)
  }

  function updateText(value: string): void {
    setText(value)
  }

  const value = {
    metadata,
    svgData,
    text,
    updateMetadata,
    updateSvgData,
    updateText,
  }

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}

export function useStateContext() {
  return useContext(StateContext)
}

export default StateProvider
