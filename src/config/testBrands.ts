import type { BrandSummary } from '@/types/brand'

/** Prefix used by Playwright smoke tests (`admin-portal.spec.ts`). */
export const PLAYWRIGHT_BRAND_NAME_PREFIX = 'Playwright Brand'
export const PLAYWRIGHT_BRAND_SLUG_PREFIX = 'playwright-brand-'

export function isPlaywrightTestBrand(brand: Pick<BrandSummary, 'name' | 'slug'>): boolean {
  const name = brand.name.trim()
  const slug = brand.slug.trim().toLowerCase()
  return (
    name.startsWith(PLAYWRIGHT_BRAND_NAME_PREFIX) ||
    slug.startsWith(PLAYWRIGHT_BRAND_SLUG_PREFIX)
  )
}

export const HIDE_TEST_BRANDS_STORAGE_KEY = 'elysia.hideTestBrands'

export function readHideTestBrandsPreference(): boolean {
  if (typeof window === 'undefined') return true
  const raw = window.localStorage.getItem(HIDE_TEST_BRANDS_STORAGE_KEY)
  if (raw === null) return true
  return raw === 'true'
}

export function writeHideTestBrandsPreference(hide: boolean): void {
  window.localStorage.setItem(HIDE_TEST_BRANDS_STORAGE_KEY, hide ? 'true' : 'false')
}
