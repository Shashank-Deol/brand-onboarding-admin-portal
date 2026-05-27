import { useState } from 'react'
import {
  createMetadataField,
  deleteMetadataField,
  updateMetadataField,
} from '@/api/brands'
import FormField from '@/components/ui/FormField'
import { useModal } from '@/context/ModalContext'
import type { MetadataField, MetadataFieldType } from '@/types/brand'

type Props = {
  brandId: string
  fields: MetadataField[]
  onChange: () => void
}

const EMPTY_FORM = {
  brand_field_name: '',
  attribute_key: '',
  description: '',
  field_type: 'string' as MetadataFieldType,
  is_required: false,
  is_platform_minimum: false,
  sort_order: 0,
}

export default function MetadataFieldsPanel({ brandId, fields, onChange }: Props) {
  const { confirm, alert } = useModal()
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    const wasEditing = Boolean(editingId)
    try {
      if (editingId) {
        await updateMetadataField(brandId, editingId, {
          ...form,
          description: form.description || null,
        })
      } else {
        await createMetadataField(brandId, {
          ...form,
          description: form.description || null,
        })
      }
      setForm(EMPTY_FORM)
      setEditingId(null)
      onChange()
      void alert({
        title: 'Saved',
        message: wasEditing
          ? 'Metadata field mapping updated.'
          : 'Metadata field mapping added.',
        tone: 'success',
        autoCloseMs: 2200,
      })
    } catch (err: unknown) {
      await alert({
        title: 'Save failed',
        message: err instanceof Error ? err.message : 'Save failed',
        tone: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  function startEdit(field: MetadataField) {
    setEditingId(field.id)
    setForm({
      brand_field_name: field.brand_field_name,
      attribute_key: field.attribute_key,
      description: field.description ?? '',
      field_type: field.field_type,
      is_required: field.is_required,
      is_platform_minimum: field.is_platform_minimum,
      sort_order: field.sort_order,
    })
  }

  async function handleDelete(fieldId: string) {
    const confirmed = await confirm({
      title: 'Delete mapping',
      message: 'Delete this metadata field mapping?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      tone: 'danger',
    })
    if (!confirmed) return
    try {
      await deleteMetadataField(brandId, fieldId)
      onChange()
    } catch (err: unknown) {
      await alert({
        title: 'Delete failed',
        message: err instanceof Error ? err.message : 'Delete failed',
        tone: 'error',
      })
    }
  }

  return (
    <div className="metadata-panel">
      <p className="section-intro">
        Map brand-specific fields to camelCase <code>metadataAttributes</code>{' '}
        keys (see data-source onboarding doc).
      </p>

      <form className="form-grid card" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit field mapping' : 'Add field mapping'}</h3>
        <FormField label="Brand field name">
          <input
            required
            value={form.brand_field_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, brand_field_name: e.target.value }))
            }
          />
        </FormField>
        <FormField label="Attribute key (camelCase)" hint="e.g. publicationTimestamp">
          <input
            required
            value={form.attribute_key}
            onChange={(e) =>
              setForm((f) => ({ ...f, attribute_key: e.target.value }))
            }
          />
        </FormField>
        <FormField label="Type">
          <select
            value={form.field_type}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                field_type: e.target.value as MetadataFieldType,
              }))
            }
          >
            <option value="string">string</option>
            <option value="integer">integer</option>
            <option value="boolean">boolean</option>
            <option value="string_array">string_array</option>
          </select>
        </FormField>
        <FormField label="Description">
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </FormField>
        <FormField label="Sort order">
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) =>
              setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
            }
          />
        </FormField>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.is_required}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_required: e.target.checked }))
            }
          />
          Required
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.is_platform_minimum}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_platform_minimum: e.target.checked }))
            }
          />
          Platform minimum field
        </label>
        <div className="form-actions">
          <button className="btn btn--primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update mapping' : 'Add mapping'}
          </button>
          {editingId && (
            <button
              className="btn"
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(EMPTY_FORM)
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="table-wrap card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Brand field</th>
              <th>Attribute key</th>
              <th>Type</th>
              <th>Flags</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 && (
              <tr>
                <td colSpan={5}>No metadata mappings yet.</td>
              </tr>
            )}
            {fields.map((field) => (
              <tr key={field.id}>
                <td>{field.brand_field_name}</td>
                <td>
                  <code>{field.attribute_key}</code>
                </td>
                <td>{field.field_type}</td>
                <td>
                  {field.is_required && <span className="tag">required</span>}
                  {field.is_platform_minimum && (
                    <span className="tag">platform</span>
                  )}
                </td>
                <td className="row-actions">
                  <button type="button" onClick={() => startEdit(field)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(field.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
