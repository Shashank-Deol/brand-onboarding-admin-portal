import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listBrands } from '@/api/brands'
import { isPlaywrightTestBrand } from '@/config/testBrands'
import { useHideTestBrands } from '@/context/HideTestBrandsContext'
import { useModal } from '@/context/ModalContext'
import type { BrandSummary } from '@/types/brand'
import './BrandsPages.css'

export default function BrandsListPage() {
  const [brands, setBrands] = useState<BrandSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { hideTestBrands } = useHideTestBrands()
  const { alert } = useModal()

  useEffect(() => {
    listBrands()
      .then(setBrands)
      .catch(async (err: unknown) => {
        await alert({
          title: 'Could not load brands',
          message: err instanceof Error ? err.message : 'Failed to load brands',
          tone: 'error',
        })
      })
      .finally(() => setLoading(false))
  }, [alert])

  const visibleBrands = useMemo(() => {
    return brands.filter((brand) => {
      if (hideTestBrands && isPlaywrightTestBrand(brand)) return false
      const normalizedQuery = query.trim().toLowerCase()
      const matchesQuery =
        normalizedQuery.length === 0 ||
        brand.name.toLowerCase().includes(normalizedQuery) ||
        brand.slug.toLowerCase().includes(normalizedQuery)
      const matchesStatus =
        statusFilter === 'all' || brand.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [brands, hideTestBrands, query, statusFilter])

  const hiddenTestCount = useMemo(
    () => brands.filter(isPlaywrightTestBrand).length,
    [brands],
  )

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Brands</h1>
        </div>
        <Link className="btn btn--primary" to="/brands/new">
          New brand
        </Link>
      </header>
      <section className="card toolbar">
        <div className="toolbar__group">
          <input
            className="toolbar__input"
            placeholder="Search brand by name or slug"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="toolbar__select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="in_review">In review</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="toolbar__meta">
          <span>
            {visibleBrands.length} shown
            {hideTestBrands && hiddenTestCount > 0
              ? ` · ${hiddenTestCount} test hidden`
              : ''}
          </span>
        </div>
      </section>

      {loading && <p>Loading brands…</p>}

      {!loading && visibleBrands.length === 0 && (
        <div className="card card--empty">
          <p>
            {brands.length === 0
              ? 'No brands yet. Create one to start onboarding config.'
              : 'No brands match your filters. Try showing Playwright test brands from the top-right toggle.'}
          </p>
        </div>
      )}

      {!loading && visibleBrands.length > 0 && (
        <div className="table-wrap card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>App ID</th>
                <th>Fit</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visibleBrands.map((brand) => (
                <tr key={brand.id}>
                  <td>
                    {brand.name}
                    {isPlaywrightTestBrand(brand) && (
                      <span className="tag tag--test">test</span>
                    )}
                  </td>
                  <td>
                    <code>{brand.slug}</code>
                  </td>
                  <td>
                    <code className="mono-truncate">{brand.app_id}</code>
                  </td>
                  <td>
                    <span className={`badge badge--${brand.fit_decision}`}>
                      {brand.fit_decision.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge--${brand.status}`}>
                      {brand.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <Link to={`/brands/${brand.id}`}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
