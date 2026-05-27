import { apiClient } from '@/api/client'
import type {
  BrandCreatePayload,
  BrandDetail,
  BrandSummary,
  BrandUpdatePayload,
  MetadataField,
  MetadataFieldPayload,
  OnboardingConfig,
} from '@/types/brand'

const BASE = '/api/v1/brands'

export function listBrands(): Promise<BrandSummary[]> {
  return apiClient<BrandSummary[]>(BASE)
}

export function getBrand(id: string): Promise<BrandDetail> {
  return apiClient<BrandDetail>(`${BASE}/${id}`)
}

export function createBrand(payload: BrandCreatePayload): Promise<BrandDetail> {
  return apiClient<BrandDetail>(BASE, { method: 'POST', body: payload })
}

export function updateBrand(
  id: string,
  payload: BrandUpdatePayload,
): Promise<BrandDetail> {
  return apiClient<BrandDetail>(`${BASE}/${id}`, { method: 'PUT', body: payload })
}

export function deleteBrand(id: string): Promise<void> {
  return apiClient<void>(`${BASE}/${id}`, { method: 'DELETE' })
}

export function updateBrandConfig(
  id: string,
  payload: Partial<OnboardingConfig>,
): Promise<OnboardingConfig> {
  return apiClient<OnboardingConfig>(`${BASE}/${id}/config`, {
    method: 'PUT',
    body: payload,
  })
}

export function listMetadataFields(brandId: string): Promise<MetadataField[]> {
  return apiClient<MetadataField[]>(`${BASE}/${brandId}/metadata-fields`)
}

export function createMetadataField(
  brandId: string,
  payload: MetadataFieldPayload,
): Promise<MetadataField> {
  return apiClient<MetadataField>(`${BASE}/${brandId}/metadata-fields`, {
    method: 'POST',
    body: payload,
  })
}

export function updateMetadataField(
  brandId: string,
  fieldId: string,
  payload: Partial<MetadataFieldPayload>,
): Promise<MetadataField> {
  return apiClient<MetadataField>(
    `${BASE}/${brandId}/metadata-fields/${fieldId}`,
    { method: 'PUT', body: payload },
  )
}

export function deleteMetadataField(
  brandId: string,
  fieldId: string,
): Promise<void> {
  return apiClient<void>(`${BASE}/${brandId}/metadata-fields/${fieldId}`, {
    method: 'DELETE',
  })
}
