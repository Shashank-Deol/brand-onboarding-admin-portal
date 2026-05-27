export type FitDecision = 'standard' | 'custom' | 'not_ready'
export type BrandStatus = 'draft' | 'in_review' | 'active' | 'archived'
export type EmbedType = 'cdn' | 'npm' | 'iframe'
export type ModelChoice = 'platform_default' | 'custom'
export type ChatPersistence = 'session_only' | 'persisted'
export type IngestionApproach = 'brand_s3_push' | 'ingestion_api'
export type AuthPattern = 'wrapper' | 'direct_oauth'
export type OfferDataSource = 'static' | 'api'
export type MetadataFieldType =
  | 'string'
  | 'integer'
  | 'boolean'
  | 'string_array'

export type WidgetConfig = {
  headerTitle: string
  welcomeMessage: string
  inputPlaceholder: string
  disclaimer: string
  headerGradientStart: string
  headerGradientEnd: string
  bodyGradientStart: string
  bodyGradientEnd: string
  widgetBorderColor: string
  logoUrl: string | null
  bodyBackgroundImageUrl: string | null
}

export type BrandingConfig = {
  embed_type: EmbedType
  design_notes: string
  cdn_widget_script_url: string
  npm_package_name: string
  iframe_chat_host_url: string
  is_button_displayed: boolean
  is_persona_selection_enabled: boolean
  widget: WidgetConfig
}

export type ModelSettingsConfig = {
  model_choice: ModelChoice
  model_id: string
  notes: string
}

export type ChatHistoryConfig = {
  persistence: ChatPersistence
  retention_days: number | null
  use_user_id: boolean
  notes: string
}

export type DataSourceConfig = {
  ingestion_approach: IngestionApproach
  formats: string[]
  source_systems_notes: string
  max_file_size_mb: number
  metadata_creation_mechanism: string
  metadata_ownership: string
  metadata_scope: string
}

export type UpsellingConfig = {
  enabled: boolean
  modal_copy: string
  cta_text: string
  business_rules: string
  offer_data_source: OfferDataSource
  compliance_notes: string
}

export type IntegrationConfig = {
  auth_pattern: AuthPattern
  cognito_pool_domain: string
  cognito_client_id: string
  cognito_client_secret_ref: string
  s3_bucket: string
  s3_prefix: string
  collection_name: string
  knowledge_base_id: string
  knowledge_base_name: string
  query_builder_notes: string
  brand_prompts: string
}

export type OnboardingConfig = {
  branding: BrandingConfig
  model_settings: ModelSettingsConfig
  chat_history: ChatHistoryConfig
  data_source: DataSourceConfig
  upselling: UpsellingConfig
  integration: IntegrationConfig
}

export type BrandSummary = {
  id: string
  name: string
  slug: string
  app_id: string
  fit_decision: FitDecision
  status: BrandStatus
  updated_at: string
}

export type MetadataField = {
  id: string
  brand_id: string
  brand_field_name: string
  attribute_key: string
  description: string | null
  field_type: MetadataFieldType
  is_required: boolean
  is_platform_minimum: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type BrandDetail = BrandSummary & {
  notes: string | null
  created_at: string
  config: OnboardingConfig
  metadata_fields: MetadataField[]
}

export type BrandCreatePayload = {
  name: string
  slug: string
  fit_decision?: FitDecision
  status?: BrandStatus
  notes?: string | null
}

export type BrandUpdatePayload = Partial<BrandCreatePayload>

export type MetadataFieldPayload = {
  brand_field_name: string
  attribute_key: string
  description?: string | null
  field_type?: MetadataFieldType
  is_required?: boolean
  is_platform_minimum?: boolean
  sort_order?: number
}
