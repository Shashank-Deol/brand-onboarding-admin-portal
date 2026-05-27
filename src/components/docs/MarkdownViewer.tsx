import { useMemo, type AnchorHTMLAttributes, type HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import MermaidDiagram from '@/components/docs/MermaidDiagram'
import { DOC_ENTRIES } from '@/docs/registry'
import './MarkdownViewer.css'

const MD_FILE_TO_SLUG: Record<string, string> = {
  README: 'overview',
  'admin-portal-guide': 'admin-portal-guide',
  'fields-reference': 'fields-reference',
  'api-reference': 'api-reference',
  'data-model': 'data-model',
  'configuration-sections': 'configuration-sections',
}

function resolveDocRoute(href: string | undefined): string | null {
  if (!href?.endsWith('.md')) return null
  const fileName = href.split('/').pop()?.replace(/\.md$/, '') ?? ''
  const slug = MD_FILE_TO_SLUG[fileName] ?? fileName
  if (fileName === 'README' && href.includes('backend/docs')) {
    return '/documentation/backend-overview'
  }
  return DOC_ENTRIES.some((d) => d.slug === slug)
    ? `/documentation/${slug}`
    : null
}

type Props = {
  content: string
}

export default function MarkdownViewer({ content }: Props) {
  const components = useMemo(
    () => ({
      a({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
        const docRoute = resolveDocRoute(href)
        if (docRoute) {
          return (
            <Link to={docRoute} {...props}>
              {children}
            </Link>
          )
        }
        const isExternal = href?.startsWith('http')
        return (
          <a
            href={href}
            {...props}
            {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            {children}
          </a>
        )
      },
      code({
        className,
        children,
        ...props
      }: HTMLAttributes<HTMLElement> & { className?: string }) {
        const match = /language-(\w+)/.exec(className ?? '')
        const language = match?.[1]
        const text = String(children).replace(/\n$/, '')

        if (language === 'mermaid') {
          return <MermaidDiagram chart={text} />
        }

        const isBlock = className?.includes('language-')
        if (isBlock) {
          return (
            <pre className={className}>
              <code {...props}>{children}</code>
            </pre>
          )
        }

        return (
          <code className="doc-inline-code" {...props}>
            {children}
          </code>
        )
      },
    }),
    [],
  )

  return (
    <article className="markdown-doc">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </article>
  )
}
