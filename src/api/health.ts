import { apiClient } from '@/api/client'
import type { HealthResponse } from '@/types/health'

export function fetchHealth(): Promise<HealthResponse> {
  return apiClient<HealthResponse>('/health')
}
