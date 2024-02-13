import { useNavigate } from 'react-router-dom'
import { Box, Button, CheckBox, Page, PageHeader, Text, TextInput } from 'grommet'
import { useEffect, useState } from 'react'

import { en } from 'locales'
import { Canvas, useStateContext } from 'components'
import { DEFAULT_STYLE, KRUGER_STYLE } from 'common/constants'

import './draw.css'

function Draw(): JSX.Element {
  const navigate = useNavigate()
  const { canvasStyle, updateCanvasStyle, updateSvgData, updateText } = useStateContext()
  const [checked, setChecked] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [texts, setTexts] = useState<string[]>([])

  const [fontSize] = useState<number>(50)
  const [fontWeight] = useState<number>(400)
  const [textAlign] = useState<string>('center')
  const [textAnchor] = useState<string>(textAlign === 'center' ? 'middle' : 'start')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 600 600"><style>.base { fill: ${
    canvasStyle.fontColor
  }; font-family:${canvasStyle.fontFamily}; font-style: ${
    canvasStyle.fontStyle
  }; font-size: ${fontSize}px; font-weight: ${fontWeight}; }</style><rect width="100%" height="100%" fill="${
    canvasStyle.bgColor
  }" />${generateText()}</svg>`

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
    setTexts([...texts, inputValue.trim()])
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

  useEffect(() => {
    checked ? updateCanvasStyle(KRUGER_STYLE) : updateCanvasStyle(DEFAULT_STYLE)
  }, [checked, updateCanvasStyle])

  return (
    <Page>
      <PageHeader title={en.draw.pageTitle} />
      <Box direction="row" gap="xlarge" wrap>
        <Box width="medium" pad="small" gap="medium" margin={{ bottom: 'large' }}>
          <Text>{en.draw.instructions}</Text>
          <TextInput
            a11yTitle={en.draw.textInput}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <Box direction="row" gap="medium">
            <Box flex>
              <Button label={en.draw.drawButton} onClick={handleDraw} size="medium" />
            </Box>
            <Box flex>
              <Button label={en.draw.resetButton} onClick={handleReset} />
            </Box>
          </Box>
          <Box pad={{ vertical: 'medium' }} align="start" className="toggle-box">
            <CheckBox name="style-toggle" label="KRUGER STYLE" onChange={(event) => setChecked(event.target.checked)} />
          </Box>
        </Box>
        <Box direction="column" gap="medium">
          <Box width="medium" border={canvasStyle.name === 'default' ? true : false}>
            <Canvas svg={svg} />
          </Box>
          <Box align="center">
            <Box width="small">
              <Button label={en.draw.navigateButton} onClick={handleNavigate} disabled={!texts.length} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Page>
  )
}

export default Draw
