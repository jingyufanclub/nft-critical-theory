import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Box, Button, Page, PageContent, PageHeader, TextInput } from 'grommet'

import { Canvas } from 'components'
import { en } from 'locales'

function Draw(): JSX.Element {
  const [bg, setBg] = useState<string>('black')
  const [fontFill, setFontFill] = useState<string>('white')
  const [fontStroke, setFontStroke] = useState<string>('none')
  const [fontFamily, setFontFamily] = useState<string>('sans-serif')
  const [fontSize, setFontSize] = useState<number>(50)
  const [fontWeight, setFontWeight] = useState<number>(700)
  const [text, setText] = useState<string[]>([])
  const [inputValue, setInputValue] = useState<string>('')

  function generateText(): string {
    const textElements: string[] = []
    let y = text.length === 1 ? '50%' : 500 / (text.length + 1) + text.length * 25
    text.forEach((t) => {
      textElements.push(`<text x="50%" y="${y}" class="base" text-anchor="middle" >${t}</text>`)
      if (typeof y === 'number') y += fontSize + 10
    })
    return textElements.join('')
  }

  function handleDraw(): void {
    setText([...text, inputValue])
    setInputValue('')
  }

  function handleReset(): void {
    setText([])
    setInputValue('')
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 500 500"><style>.base { fill: ${fontFill}; stroke: ${fontStroke}; font-family: ${fontFamily}; font-size: ${fontSize}px; font-weight: ${fontWeight}; }</style><rect width="100%" height="100%" fill="${bg}" />${generateText()}</svg>`

  const svgData = `data:image/svg+xml;base64, ${window.btoa(unescape(encodeURIComponent(svg)))}`

  return (
    <Page>
      <PageContent>
        <PageHeader title={en.draw.pageTitle} />
        <Box direction="row" gap="medium" wrap>
          <Box width="medium" pad="small">
            <TextInput value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
            <Box direction="row" gap="medium" pad={{ vertical: 'medium' }}>
              <Box flex>
                <Button label="Draw" onClick={handleDraw} />
              </Box>
              <Box flex>
                <Button label="Reset" onClick={handleReset} />
              </Box>
            </Box>
          </Box>
          <Box width="medium" border>
            <Canvas svg={svg} />
          </Box>
        </Box>
        <Link to="/mint" state={{ svgData }}>
          Mint
        </Link>
      </PageContent>
    </Page>
  )
}

export default Draw
