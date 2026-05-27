import { NavLink, Navigate, useParams } from 'react-router-dom'
import MarkdownViewer from '@/components/docs/MarkdownViewer'
import { DEFAULT_DOC_SLUG, DOC_ENTRIES, getDocBySlug } from '@/docs/registry'
import './DocumentationPage.css'

export default function DocumentationPage() {
  const { docSlug } = useParams()
  const slug = docSlug ?? DEFAULT_DOC_SLUG
  const doc = getDocBySlug(slug)

  if (!doc) {
    return <Navigate to={`/documentation/${DEFAULT_DOC_SLUG}`} replace />
  }

  const portalDocs = DOC_ENTRIES.filter((d) => d.category === 'portal')
  const backendDocs = DOC_ENTRIES.filter((d) => d.category === 'backend')

  return (
    <div className="doc-page">
      <header className="doc-page__header">
        <h1>Documentation</h1>
        <p className="doc-page__subtitle">
          Guides for using the admin portal, field formats, and backend API reference.
          Markdown sources live in <code>frontend/docs/</code> and{' '}
          <code>backend/docs/</code>.
        </p>
      </header>

      <div className="doc-page__layout">
        <nav className="doc-page__toc" aria-label="Documentation topics">
          <section>
            <h2>Admin portal</h2>
            <ul>
              {portalDocs.map((entry) => (
                <li key={entry.slug}>
                  <NavLink
                    to={`/documentation/${entry.slug}`}
                    className={({ isActive }) =>
                      isActive ? 'doc-page__link active' : 'doc-page__link'
                    }
                  >
                    {entry.title}
                  </NavLink>
                  <span className="doc-page__desc">{entry.description}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Backend</h2>
            <ul>
              {backendDocs.map((entry) => (
                <li key={entry.slug}>
                  <NavLink
                    to={`/documentation/${entry.slug}`}
                    className={({ isActive }) =>
                      isActive ? 'doc-page__link active' : 'doc-page__link'
                    }
                  >
                    {entry.title}
                  </NavLink>
                  <span className="doc-page__desc">{entry.description}</span>
                </li>
              ))}
            </ul>
          </section>
        </nav>

        <div className="doc-page__content card">
          <MarkdownViewer content={doc.content} />
        </div>
      </div>
    </div>
  )
}
