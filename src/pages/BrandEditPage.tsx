import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createBrand,
  deleteBrand,
  getBrand,
  updateBrand,
  updateBrandConfig,
} from '@/api/brands'
import BrandTabs from '@/components/brands/BrandTabs'
import ConfigTabContent from '@/components/brands/ConfigTabContent'
import type { TabId } from '@/components/brands/configTabs'
import FormField from '@/components/ui/FormField'
import { useModal } from '@/context/ModalContext'
import type {
  BrandDetail,
  BrandStatus,
  FitDecision,
  OnboardingConfig,
} from '@/types/brand'
import './BrandsPages.css'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function BrandEditPage() {
  const { brandId } = useParams()
  const navigate = useNavigate()
  const { confirm, alert } = useModal()
  // `/brands/new` route doesn't provide a `brandId` param, so treat missing id as create mode.
  const isNew = !brandId || brandId === 'new'

  const [brand, setBrand] = useState<BrandDetail | null>(null)
  const [config, setConfig] = useState<OnboardingConfig | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('branding')
  const [loading, setLoading] = useState(!isNew)

  const [identity, setIdentity] = useState({
    name: '',
    slug: '',
    fit_decision: 'not_ready' as FitDecision,
    status: 'draft' as BrandStatus,
    notes: '',
  })

  const loadBrand = useCallback(async () => {
    if (!brandId || isNew) return
    setLoading(true)
    try {
      const data = await getBrand(brandId)
      setBrand(data)
      setConfig(data.config)
      setIdentity({
        name: data.name,
        slug: data.slug,
        fit_decision: data.fit_decision,
        status: data.status,
        notes: data.notes ?? '',
      })
    } catch (err: unknown) {
      await alert({
        title: 'Could not load brand',
        message: err instanceof Error ? err.message : 'Failed to load brand',
        tone: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [alert, brandId, isNew])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadBrand()
  }, [loadBrand])

  async function saveIdentity(event: React.FormEvent) {
    event.preventDefault()
    try {
      if (isNew) {
        const created = await createBrand({
          name: identity.name,
          slug: identity.slug,
          fit_decision: identity.fit_decision,
          status: identity.status,
          notes: identity.notes || null,
        })
        navigate(`/brands/${created.id}`, { replace: true })
        return
      }
      if (!brandId) return
      const updated = await updateBrand(brandId, {
        name: identity.name,
        slug: identity.slug,
        fit_decision: identity.fit_decision,
        status: identity.status,
        notes: identity.notes || null,
      })
      setBrand(updated)
      await alert({
        title: 'Saved',
        message: 'Brand details saved.',
        tone: 'success',
        autoCloseMs: 2200,
      })
    } catch (err: unknown) {
      await alert({
        title: 'Save failed',
        message: err instanceof Error ? err.message : 'Save failed',
        tone: 'error',
      })
    }
  }

  async function saveConfigSection(section: Partial<OnboardingConfig>) {
    if (!brandId || isNew) {
      await alert({
        title: 'Save brand first',
        message: 'Create and save brand identity before updating configuration.',
        tone: 'info',
      })
      return
    }
    try {
      const updated = await updateBrandConfig(brandId, section)
      setConfig(updated)
      await alert({
        title: 'Saved',
        message: 'Configuration saved.',
        tone: 'success',
        autoCloseMs: 2200,
      })
    } catch (err: unknown) {
      await alert({
        title: 'Save failed',
        message: err instanceof Error ? err.message : 'Save failed',
        tone: 'error',
      })
    }
  }

  async function handleDelete() {
    if (!brandId || isNew) return
    const confirmed = await confirm({
      title: 'Delete brand',
      message:
        'Delete this brand and all onboarding configuration? This cannot be undone.',
      confirmLabel: 'Delete brand',
      cancelLabel: 'Cancel',
      tone: 'danger',
    })
    if (!confirmed) return
    try {
      await deleteBrand(brandId)
      navigate('/')
    } catch (err: unknown) {
      await alert({
        title: 'Delete failed',
        message: err instanceof Error ? err.message : 'Delete failed',
        tone: 'error',
      })
    }
  }

  function patchConfig<K extends keyof OnboardingConfig>(
    key: K,
    value: OnboardingConfig[K],
  ) {
    setConfig((current) =>
      current ? { ...current, [key]: value } : current,
    )
  }

  const progress = useMemo(() => {
    if (!config) return 0
    let completed = 0
    if (identity.name && identity.slug) completed += 1
    if (config.branding.embed_type) completed += 1
    if (config.model_settings.model_choice) completed += 1
    if (config.chat_history.persistence) completed += 1
    if (config.data_source.ingestion_approach) completed += 1
    if (brand && brand.metadata_fields.length > 0) completed += 1
    if (config.integration.auth_pattern) completed += 1
    return Math.round((completed / 7) * 100)
  }, [brand, config, identity.name, identity.slug])

  if (loading) return <p>Loading brand…</p>

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <Link className="back-link" to="/">
            ← Brands
          </Link>
          <h1>{isNew ? 'New brand' : brand?.name ?? 'Brand'}</h1>
          {!isNew && brand && (
            <p className="page__subtitle">
              App ID: <code>{brand.app_id}</code>
            </p>
          )}
        </div>
        {!isNew && (
          <button className="btn btn--danger" type="button" onClick={handleDelete}>
            Delete brand
          </button>
        )}
      </header>

      {!isNew && brand && (
        <section className="metric-grid">
          <article className="metric-card">
            <p>Onboarding Progress</p>
            <strong>{progress}%</strong>
          </article>
          <article className="metric-card">
            <p>Metadata Mappings</p>
            <strong>{brand.metadata_fields.length}</strong>
          </article>
          <article className="metric-card">
            <p>Current Status</p>
            <strong>{identity.status.replace('_', ' ')}</strong>
          </article>
        </section>
      )}

      <form className="card form-grid form-grid--two-col" onSubmit={saveIdentity}>
        <h2>Brand identity</h2>
        <FormField label="Brand name">
          <input
            required
            value={identity.name}
            onChange={(e) => {
              const name = e.target.value
              setIdentity((prev) => ({
                ...prev,
                name,
                slug: isNew && !prev.slug ? slugify(name) : prev.slug,
              }))
            }}
          />
        </FormField>
        <FormField label="Slug" hint="Lowercase letters, numbers, hyphens only">
          <input
            required
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            value={identity.slug}
            onChange={(e) =>
              setIdentity((prev) => ({ ...prev, slug: e.target.value }))
            }
          />
        </FormField>
        <FormField label="Fit decision">
          <select
            value={identity.fit_decision}
            onChange={(e) =>
              setIdentity((prev) => ({
                ...prev,
                fit_decision: e.target.value as FitDecision,
              }))
            }
          >
            <option value="not_ready">Not ready</option>
            <option value="standard">Standard onboarding</option>
            <option value="custom">Custom / changes required</option>
          </select>
        </FormField>
        <FormField label="Status">
          <select
            value={identity.status}
            onChange={(e) =>
              setIdentity((prev) => ({
                ...prev,
                status: e.target.value as BrandStatus,
              }))
            }
          >
            <option value="draft">Draft</option>
            <option value="in_review">In review</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </FormField>
        <FormField label="Notes">
          <textarea
            value={identity.notes}
            onChange={(e) =>
              setIdentity((prev) => ({ ...prev, notes: e.target.value }))
            }
          />
        </FormField>
        <div className="form-actions">
          <button className="btn btn--primary" type="submit">
            {isNew ? 'Create brand' : 'Save identity'}
          </button>
        </div>
      </form>

      {!isNew && config && brand && (
        <>
          <BrandTabs activeTab={activeTab} onSelect={setActiveTab} />
          <ConfigTabContent
            activeTab={activeTab}
            brand={brand}
            config={config}
            patchConfig={patchConfig}
            saveConfigSection={saveConfigSection}
            onMetadataRefresh={loadBrand}
          />
        </>
      )}
    </div>
  )
}
