import adminPortalGuide from '../../docs/admin-portal-guide.md?raw'
import fieldsReference from '../../docs/fields-reference.md?raw'
import frontendReadme from '../../docs/README.md?raw'
import apiReference from '../../../backend/docs/api-reference.md?raw'
import backendReadme from '../../../backend/docs/README.md?raw'
import configSections from '../../../backend/docs/configuration-sections.md?raw'
import dataModel from '../../../backend/docs/data-model.md?raw'

export type DocCategory = 'portal' | 'backend'

export type DocEntry = {
  slug: string
  title: string
  description: string
  category: DocCategory
  content: string
}

export const DOC_ENTRIES: DocEntry[] = [
  {
    slug: 'overview',
    title: 'Overview',
    description: 'Frontend documentation index and architecture',
    category: 'portal',
    content: frontendReadme,
  },
  {
    slug: 'admin-portal-guide',
    title: 'Admin portal guide',
    description: 'Step-by-step usage for onboarding engineers',
    category: 'portal',
    content: adminPortalGuide,
  },
  {
    slug: 'fields-reference',
    title: 'Fields reference',
    description: 'Required fields, formats, and enum values',
    category: 'portal',
    content: fieldsReference,
  },
  {
    slug: 'backend-overview',
    title: 'Backend overview',
    description: 'API service layout and local setup',
    category: 'backend',
    content: backendReadme,
  },
  {
    slug: 'api-reference',
    title: 'API reference',
    description: 'REST endpoints and error codes',
    category: 'backend',
    content: apiReference,
  },
  {
    slug: 'data-model',
    title: 'Data model',
    description: 'Tables, ER diagram, and enums',
    category: 'backend',
    content: dataModel,
  },
  {
    slug: 'configuration-sections',
    title: 'Configuration sections',
    description: 'JSONB shapes and update semantics',
    category: 'backend',
    content: configSections,
  },
]

export function getDocBySlug(slug: string): DocEntry | undefined {
  return DOC_ENTRIES.find((doc) => doc.slug === slug)
}

export const DEFAULT_DOC_SLUG = 'admin-portal-guide'
