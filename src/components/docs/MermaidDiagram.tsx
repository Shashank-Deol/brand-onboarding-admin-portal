import { useEffect, useId, useState } from 'react'
import mermaid from 'mermaid'

let mermaidInitialized = false

function initMermaid() {
  if (mermaidInitialized) return
  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'strict',
  })
  mermaidInitialized = true
}

type Props = {
  chart: string
}

export default function MermaidDiagram({ chart }: Props) {
  const id = useId().replace(/:/g, '')
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initMermaid()
    const source = chart.trim()
    if (!source) return

    mermaid
      .render(`mermaid-${id}`, source)
      .then(({ svg: rendered }) => setSvg(rendered))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Diagram render failed')
      })
  }, [chart, id])

  if (error) {
    return (
      <pre className="doc-mermaid doc-mermaid--error">
        <code>{chart}</code>
        <span>{error}</span>
      </pre>
    )
  }

  if (!svg) {
    return <div className="doc-mermaid doc-mermaid--loading">Rendering diagram…</div>
  }

  return (
    <div
      className="doc-mermaid"
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-label="Diagram"
    />
  )
}
