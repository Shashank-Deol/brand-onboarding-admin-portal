import MetadataFieldsPanel from '@/components/brands/MetadataFieldsPanel'
import type { TabId } from '@/components/brands/configTabs'
import FormField from '@/components/ui/FormField'
import type { BrandDetail, OnboardingConfig } from '@/types/brand'

type Props = {
  activeTab: TabId
  brand: BrandDetail
  config: OnboardingConfig
  patchConfig: <K extends keyof OnboardingConfig>(
    key: K,
    value: OnboardingConfig[K],
  ) => void
  saveConfigSection: (section: Partial<OnboardingConfig>) => Promise<void>
  onMetadataRefresh: () => void
}

export default function ConfigTabContent({
  activeTab,
  brand,
  config,
  patchConfig,
  saveConfigSection,
  onMetadataRefresh,
}: Props) {
  if (activeTab === 'metadata') {
    return (
      <MetadataFieldsPanel
        brandId={brand.id}
        fields={brand.metadata_fields}
        onChange={onMetadataRefresh}
      />
    )
  }

  if (activeTab === 'branding') {
    return (
      <section className="card form-grid form-grid--two-col">
        <h2>Branding & frontend embed</h2>
        <FormField label="Embed type">
          <select
            value={config.branding.embed_type}
            onChange={(e) =>
              patchConfig('branding', {
                ...config.branding,
                embed_type: e.target.value as OnboardingConfig['branding']['embed_type'],
              })
            }
          >
            <option value="cdn">CDN script</option>
            <option value="npm">npm package</option>
            <option value="iframe">iframe</option>
          </select>
        </FormField>
        <FormField label="CDN widget script URL">
          <input
            value={config.branding.cdn_widget_script_url}
            onChange={(e) =>
              patchConfig('branding', {
                ...config.branding,
                cdn_widget_script_url: e.target.value,
              })
            }
          />
        </FormField>
        <FormField label="npm package name">
          <input
            value={config.branding.npm_package_name}
            onChange={(e) =>
              patchConfig('branding', {
                ...config.branding,
                npm_package_name: e.target.value,
              })
            }
          />
        </FormField>
        <FormField label="iframe chat host URL">
          <input
            value={config.branding.iframe_chat_host_url}
            onChange={(e) =>
              patchConfig('branding', {
                ...config.branding,
                iframe_chat_host_url: e.target.value,
              })
            }
          />
        </FormField>
        <FormField label="Design notes">
          <textarea
            value={config.branding.design_notes}
            onChange={(e) =>
              patchConfig('branding', {
                ...config.branding,
                design_notes: e.target.value,
              })
            }
          />
        </FormField>
        <div className="checkbox-stack">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={config.branding.is_button_displayed}
              onChange={(e) =>
                patchConfig('branding', {
                  ...config.branding,
                  is_button_displayed: e.target.checked,
                })
              }
            />
            Show launcher button
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={config.branding.is_persona_selection_enabled}
              onChange={(e) =>
                patchConfig('branding', {
                  ...config.branding,
                  is_persona_selection_enabled: e.target.checked,
                })
              }
            />
            Persona selection enabled
          </label>
        </div>
        <h3>Widget appearance</h3>
        <FormField label="Header title">
          <input
            value={config.branding.widget.headerTitle}
            onChange={(e) =>
              patchConfig('branding', {
                ...config.branding,
                widget: {
                  ...config.branding.widget,
                  headerTitle: e.target.value,
                },
              })
            }
          />
        </FormField>
        <FormField label="Welcome message">
          <textarea
            value={config.branding.widget.welcomeMessage}
            onChange={(e) =>
              patchConfig('branding', {
                ...config.branding,
                widget: {
                  ...config.branding.widget,
                  welcomeMessage: e.target.value,
                },
              })
            }
          />
        </FormField>
        <div className="form-actions">
          <button
            className="btn btn--primary"
            type="button"
            onClick={() => void saveConfigSection({ branding: config.branding })}
          >
            Save branding
          </button>
        </div>
      </section>
    )
  }

  if (activeTab === 'model') {
    return (
      <section className="card form-grid form-grid--two-col">
        <h2>Model configuration</h2>
        <FormField label="Model choice">
          <select
            value={config.model_settings.model_choice}
            onChange={(e) =>
              patchConfig('model_settings', {
                ...config.model_settings,
                model_choice: e.target.value as OnboardingConfig['model_settings']['model_choice'],
              })
            }
          >
            <option value="platform_default">Platform default</option>
            <option value="custom">Custom / alternate</option>
          </select>
        </FormField>
        <FormField label="Model ID / name (if custom)">
          <input
            value={config.model_settings.model_id}
            onChange={(e) =>
              patchConfig('model_settings', {
                ...config.model_settings,
                model_id: e.target.value,
              })
            }
          />
        </FormField>
        <FormField label="Notes">
          <textarea
            value={config.model_settings.notes}
            onChange={(e) =>
              patchConfig('model_settings', {
                ...config.model_settings,
                notes: e.target.value,
              })
            }
          />
        </FormField>
        <div className="form-actions">
          <button
            className="btn btn--primary"
            type="button"
            onClick={() => void saveConfigSection({ model_settings: config.model_settings })}
          >
            Save model config
          </button>
        </div>
      </section>
    )
  }

  if (activeTab === 'chat') {
    return (
      <section className="card form-grid form-grid--two-col">
        <h2>Chat history</h2>
        <FormField label="Persistence">
          <select
            value={config.chat_history.persistence}
            onChange={(e) =>
              patchConfig('chat_history', {
                ...config.chat_history,
                persistence: e.target.value as OnboardingConfig['chat_history']['persistence'],
              })
            }
          >
            <option value="session_only">Session only</option>
            <option value="persisted">Persisted across sessions</option>
          </select>
        </FormField>
        <FormField label="Retention (days)">
          <input
            type="number"
            min={0}
            value={config.chat_history.retention_days ?? ''}
            onChange={(e) =>
              patchConfig('chat_history', {
                ...config.chat_history,
                retention_days: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </FormField>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={config.chat_history.use_user_id}
            onChange={(e) =>
              patchConfig('chat_history', {
                ...config.chat_history,
                use_user_id: e.target.checked,
              })
            }
          />
          Use user_id in metadata
        </label>
        <FormField label="Notes">
          <textarea
            value={config.chat_history.notes}
            onChange={(e) =>
              patchConfig('chat_history', {
                ...config.chat_history,
                notes: e.target.value,
              })
            }
          />
        </FormField>
        <div className="form-actions">
          <button
            className="btn btn--primary"
            type="button"
            onClick={() => void saveConfigSection({ chat_history: config.chat_history })}
          >
            Save chat history config
          </button>
        </div>
      </section>
    )
  }

  if (activeTab === 'data') {
    return (
      <section className="card form-grid form-grid--two-col">
        <h2>Data source & ingestion</h2>
        <FormField label="Ingestion approach (config only)">
          <select
            value={config.data_source.ingestion_approach}
            onChange={(e) =>
              patchConfig('data_source', {
                ...config.data_source,
                ingestion_approach: e.target.value as OnboardingConfig['data_source']['ingestion_approach'],
              })
            }
          >
            <option value="ingestion_api">Ingestion API</option>
            <option value="brand_s3_push">Brand pushes to S3</option>
          </select>
        </FormField>
        <FormField label="Formats (comma-separated)">
          <input
            value={config.data_source.formats.join(', ')}
            onChange={(e) =>
              patchConfig('data_source', {
                ...config.data_source,
                formats: e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </FormField>
        <FormField label="Max file size (MB)">
          <input
            type="number"
            value={config.data_source.max_file_size_mb}
            onChange={(e) =>
              patchConfig('data_source', {
                ...config.data_source,
                max_file_size_mb: Number(e.target.value),
              })
            }
          />
        </FormField>
        <FormField label="Source systems notes">
          <textarea
            value={config.data_source.source_systems_notes}
            onChange={(e) =>
              patchConfig('data_source', {
                ...config.data_source,
                source_systems_notes: e.target.value,
              })
            }
          />
        </FormField>
        <FormField label="Metadata creation mechanism">
          <textarea
            value={config.data_source.metadata_creation_mechanism}
            onChange={(e) =>
              patchConfig('data_source', {
                ...config.data_source,
                metadata_creation_mechanism: e.target.value,
              })
            }
          />
        </FormField>
        <FormField label="Metadata ownership">
          <input
            value={config.data_source.metadata_ownership}
            onChange={(e) =>
              patchConfig('data_source', {
                ...config.data_source,
                metadata_ownership: e.target.value,
              })
            }
          />
        </FormField>
        <FormField label="Metadata scope">
          <input
            value={config.data_source.metadata_scope}
            onChange={(e) =>
              patchConfig('data_source', {
                ...config.data_source,
                metadata_scope: e.target.value,
              })
            }
          />
        </FormField>
        <div className="form-actions">
          <button
            className="btn btn--primary"
            type="button"
            onClick={() => void saveConfigSection({ data_source: config.data_source })}
          >
            Save data source config
          </button>
        </div>
      </section>
    )
  }

  if (activeTab === 'upsell') {
    return (
      <section className="card form-grid form-grid--two-col">
        <h2>Upselling modal</h2>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={config.upselling.enabled}
            onChange={(e) =>
              patchConfig('upselling', {
                ...config.upselling,
                enabled: e.target.checked,
              })
            }
          />
          Upselling enabled
        </label>
        <FormField label="Modal copy">
          <textarea
            value={config.upselling.modal_copy}
            onChange={(e) =>
              patchConfig('upselling', {
                ...config.upselling,
                modal_copy: e.target.value,
              })
            }
          />
        </FormField>
        <FormField label="CTA text">
          <input
            value={config.upselling.cta_text}
            onChange={(e) =>
              patchConfig('upselling', {
                ...config.upselling,
                cta_text: e.target.value,
              })
            }
          />
        </FormField>
        <FormField label="Business rules">
          <textarea
            value={config.upselling.business_rules}
            onChange={(e) =>
              patchConfig('upselling', {
                ...config.upselling,
                business_rules: e.target.value,
              })
            }
          />
        </FormField>
        <FormField label="Offer data source">
          <select
            value={config.upselling.offer_data_source}
            onChange={(e) =>
              patchConfig('upselling', {
                ...config.upselling,
                offer_data_source: e.target.value as OnboardingConfig['upselling']['offer_data_source'],
              })
            }
          >
            <option value="static">Static config</option>
            <option value="api">External API</option>
          </select>
        </FormField>
        <FormField label="Compliance notes">
          <textarea
            value={config.upselling.compliance_notes}
            onChange={(e) =>
              patchConfig('upselling', {
                ...config.upselling,
                compliance_notes: e.target.value,
              })
            }
          />
        </FormField>
        <div className="form-actions">
          <button
            className="btn btn--primary"
            type="button"
            onClick={() => void saveConfigSection({ upselling: config.upselling })}
          >
            Save upselling config
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="card form-grid form-grid--two-col">
      <h2>Integration placeholders</h2>
      <p className="section-intro">
        Store Cognito, S3, and knowledge-base references for onboarding. Not connected to AWS yet.
      </p>
      <FormField label="Auth pattern">
        <select
          value={config.integration.auth_pattern}
          onChange={(e) =>
            patchConfig('integration', {
              ...config.integration,
              auth_pattern: e.target.value as OnboardingConfig['integration']['auth_pattern'],
            })
          }
        >
          <option value="wrapper">Elysia wrapper</option>
          <option value="direct_oauth">Direct OAuth2</option>
        </select>
      </FormField>
      <FormField label="Cognito pool domain">
        <input
          value={config.integration.cognito_pool_domain}
          onChange={(e) =>
            patchConfig('integration', {
              ...config.integration,
              cognito_pool_domain: e.target.value,
            })
          }
        />
      </FormField>
      <FormField label="Cognito client ID">
        <input
          value={config.integration.cognito_client_id}
          onChange={(e) =>
            patchConfig('integration', {
              ...config.integration,
              cognito_client_id: e.target.value,
            })
          }
        />
      </FormField>
      <FormField label="Client secret reference">
        <input
          value={config.integration.cognito_client_secret_ref}
          onChange={(e) =>
            patchConfig('integration', {
              ...config.integration,
              cognito_client_secret_ref: e.target.value,
            })
          }
        />
      </FormField>
      <FormField label="S3 bucket">
        <input
          value={config.integration.s3_bucket}
          onChange={(e) =>
            patchConfig('integration', {
              ...config.integration,
              s3_bucket: e.target.value,
            })
          }
        />
      </FormField>
      <FormField label="S3 prefix">
        <input
          value={config.integration.s3_prefix}
          onChange={(e) =>
            patchConfig('integration', {
              ...config.integration,
              s3_prefix: e.target.value,
            })
          }
        />
      </FormField>
      <FormField label="Collection name">
        <input
          value={config.integration.collection_name}
          onChange={(e) =>
            patchConfig('integration', {
              ...config.integration,
              collection_name: e.target.value,
            })
          }
        />
      </FormField>
      <FormField label="Knowledge base ID">
        <input
          value={config.integration.knowledge_base_id}
          onChange={(e) =>
            patchConfig('integration', {
              ...config.integration,
              knowledge_base_id: e.target.value,
            })
          }
        />
      </FormField>
      <FormField label="Knowledge base name">
        <input
          value={config.integration.knowledge_base_name}
          onChange={(e) =>
            patchConfig('integration', {
              ...config.integration,
              knowledge_base_name: e.target.value,
            })
          }
        />
      </FormField>
      <FormField label="Query builder notes">
        <textarea
          value={config.integration.query_builder_notes}
          onChange={(e) =>
            patchConfig('integration', {
              ...config.integration,
              query_builder_notes: e.target.value,
            })
          }
        />
      </FormField>
      <FormField label="Brand prompts">
        <textarea
          value={config.integration.brand_prompts}
          onChange={(e) =>
            patchConfig('integration', {
              ...config.integration,
              brand_prompts: e.target.value,
            })
          }
        />
      </FormField>
      <div className="form-actions">
        <button
          className="btn btn--primary"
          type="button"
          onClick={() => void saveConfigSection({ integration: config.integration })}
        >
          Save integration placeholders
        </button>
      </div>
    </section>
  )
}
