import { useNavigate } from 'react-router-dom'
import { Box, Button, Page, PageHeader, RadioButtonGroup, Text, TextInput } from 'grommet'
import { useEffect, useState } from 'react'

import { en } from 'locales'
import { Canvas, useStateContext } from 'components'

import './draw.css'
import { CanvasStyleName } from 'common/entities'

const canvasStyleOptions: CanvasStyleName[] = ['default', 'kruger', 'weiner']

function Draw(): JSX.Element {
  const navigate = useNavigate()
  const { canvasStyle, updateCanvasStyleName, updateSvgData, updateText } = useStateContext()
  const [styleOption, setStyleOption] = useState<CanvasStyleName>(canvasStyleOptions[0])
  const [inputValue, setInputValue] = useState<string>('')
  const [texts, setTexts] = useState<string[]>([])

  const [textAlign] = useState<string>('center')
  const [textAnchor] = useState<string>(textAlign === 'center' ? 'middle' : 'start')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 600 600"><style>.base { fill: ${
    canvasStyle.fontColor
  }; font-family:${canvasStyle.fontFamily}; font-style: ${canvasStyle.fontStyle}; font-size: ${
    canvasStyle.fontSize
  }px; font-weight: ${canvasStyle.fontWeight};
    ${
      canvasStyle.fontStroke
        ? `paint-order: stroke; stroke: ${canvasStyle.fontStroke}; stroke-width: 5px; stroke-linecap: butt; stroke-linejoin: miter;`
        : null
    }
  }</style><rect width="100%" height="100%" fill="${canvasStyle.bgColor}" />${generateText()}</svg>`

  const svgData = `data:image/svg+xml;base64, ${window.btoa(unescape(encodeURIComponent(svg)))}`

  const text = texts.join(' ')

  function generateText(): string {
    const textElements: string[] = []
    const x = textAlign === 'center' ? '50%' : 40
    let y = texts.length === 1 ? '50%' : 600 / (texts.length + 1) + texts.length * 24
    texts.forEach((t) => {
      textElements.push(`<text x="${x}" y="${y}" class="base" text-anchor="${textAnchor}" >${t}</text>`)
      if (typeof y === 'number') y += canvasStyle.fontSize + 10
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
    updateCanvasStyleName(styleOption)
  }, [styleOption, updateCanvasStyleName])

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
          <Box pad={{ vertical: 'medium' }} align="start" className="canvas-style-radio-group">
            <RadioButtonGroup
              name="canvas-style-selection"
              options={canvasStyleOptions}
              value={styleOption}
              onChange={(event) => setStyleOption(event.target.value as CanvasStyleName)}
            />
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
