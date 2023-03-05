import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useStateContext } from 'components'
import { Box, Button, Image, Page, PageContent, PageHeader, Text, TextInput } from 'grommet'

import { en } from 'locales'

function Draw(): JSX.Element {
  const navigate = useNavigate()
  const { updateSvgData, updateText } = useStateContext()
  const [bg, setBg] = useState<string>('black')
  const [fontFill, setFontFill] = useState<string>('white')
  const [fontSize, setFontSize] = useState<number>(50)
  const [fontWeight, setFontWeight] = useState<number>(400)
  const [textAlign, setTextAlign] = useState<string>('center')
  const [textAnchor] = useState<string>(textAlign === 'center' ? 'middle' : 'start')
  const [texts, setTexts] = useState<string[]>([])
  const [inputValue, setInputValue] = useState<string>('')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 600 600"><style>.base { fill: ${fontFill}; font-family:futura,helvetica,sans-serif; font-size: ${fontSize}px; font-weight: ${fontWeight}; }</style><rect width="100%" height="100%" fill="${bg}" />${generateText()}</svg>`

  const svgData = `data:image/svg+xml;base64, ${window.btoa(unescape(encodeURIComponent(svg)))}`

  const text = texts.join(' ')

  function generateText(): string {
    const textElements: string[] = []
    const x = textAlign === 'center' ? '50%' : 40
    let y = texts.length === 1 ? '50%' : 600 / (texts.length + 1) + texts.length * 24
    texts.forEach((t) => {
      textElements.push(`<text x="${x}" y="${y}" class="base" text-anchor="${textAnchor}" >${t}</text>`)
      if (typeof y === 'number') y += fontSize + 10
    })
    return textElements.join('')
  }

  function handleDraw(): void {
    setTexts([...texts, inputValue])
    setInputValue('')
  }

  function handleReset(): void {
    setTexts([])
    setInputValue('')
  }

  function handleNavigate(): void {
    updateSvgData(svgData)
    updateText(text)
    navigate('/metadata')
  }

  return (
    <Page>
      <PageContent>
        <PageHeader title={en.draw.pageTitle} />
        <Box direction="row" gap="xlarge" wrap>
          <Box width="medium" pad="small" gap="medium" margin={{ bottom: 'large' }}>
            <Text>{en.draw.instructions}</Text>
            <TextInput value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
            <Box direction="row" gap="medium">
              <Box flex>
                <Button label={en.draw.drawButton} onClick={handleDraw} size="medium" />
              </Box>
              <Box flex>
                <Button label={en.draw.resetButton} onClick={handleReset} />
              </Box>
            </Box>
          </Box>
          <Box direction="column" gap="medium">
            <Box width="medium" border>
              <Image src={svgData} />
            </Box>
            <Box align="center">
              <Box width="small">
                <Button label={en.draw.navigateButton} onClick={handleNavigate} />
              </Box>
            </Box>
          </Box>
        </Box>
      </PageContent>
    </Page>
  )
}

export default Draw
