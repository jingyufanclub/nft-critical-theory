import { useEffect, useRef } from 'react'

export interface CanvasProps {
  svg: string
}

function Canvas({ svg }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d')
      const ctx = canvasCtxRef.current
      const image = new Image()
      image.src = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`
      image.onload = () => {
        if (ctx) {
          ctx.drawImage(image, 0, 0)
        }
      }
    }
  }, [svg])

  return <canvas ref={canvasRef} width="1000" height="1000" />
}

export default Canvas
