export type TabId =
  | 'branding'
  | 'model'
  | 'chat'
  | 'data'
  | 'metadata'
  | 'upsell'
  | 'integration'

export const TABS: { id: TabId; label: string; hint: string }[] = [
  { id: 'branding', label: 'Branding & embed', hint: 'Widget look and embed method' },
  { id: 'model', label: 'Model', hint: 'LLM and quality settings' },
  { id: 'chat', label: 'Chat history', hint: 'Retention and persistence controls' },
  { id: 'data', label: 'Data source', hint: 'Ingestion approach and metadata process' },
  { id: 'metadata', label: 'Metadata fields', hint: 'Field mappings for sidecars' },
  { id: 'upsell', label: 'Upselling', hint: 'Commercial modal rules' },
  { id: 'integration', label: 'Integration (placeholders)', hint: 'Cognito, S3, KB references' },
]
