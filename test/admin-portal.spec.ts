import { expect, test } from '@playwright/test'

// Requested tracking sequence kept in code: 1,22,3,4,4,5
const TRACKING_SEQUENCE = [1, 22, 3, 4, 4, 5] as const

function trackedFieldName(index: number): string {
  const seq = TRACKING_SEQUENCE[index] ?? index + 1
  return `test_fieldname+${seq}`
}

test('admin portal full smoke flow', async ({ page }) => {
  const stamp = Date.now().toString().slice(-6)
  const brandName = `Playwright Brand ${stamp}`
  const brandSlug = `playwright-brand-${stamp}`

  await page.goto('/')

  await page.getByRole('link', { name: 'New brand' }).click()
  await expect(page.getByRole('heading', { name: 'New brand' })).toBeVisible()

  await page.getByLabel('Brand name').fill(brandName)
  await page.getByLabel('Slug').fill(brandSlug)
  await page.getByLabel('Fit decision').selectOption('custom')
  await page.getByLabel('Status').selectOption('in_review')
  await page.getByLabel('Notes').fill('Created by Playwright smoke test.')
  await page.getByRole('button', { name: 'Create brand' }).click()

  await expect(page).toHaveURL(/\/brands\/(?!new)[^/]+$/)
  const brandEditPath = new URL(page.url()).pathname
  await expect(page.getByRole('heading', { name: brandName })).toBeVisible()
  await expect(page.getByText('Onboarding Progress')).toBeVisible()

  // Branding tab
  await page.getByLabel('CDN widget script URL').fill('https://cdn.example.com/widget/main.js')
  await page.getByLabel('npm package name').fill('@informa/test-widget')
  await page.getByLabel('iframe chat host URL').fill('https://chat.example.com')
  await page.getByLabel('Design notes').fill('Neon style with compact spacing.')
  await page.getByLabel('Header title').fill('Elysia Test UI')
  await page.getByLabel('Welcome message').fill('Welcome from Playwright.')
  await page.getByRole('button', { name: 'Save branding' }).click()
  await expect(page.getByText('Configuration saved.')).toBeVisible()

  // Model tab
  await page.getByRole('button', { name: /Model/i }).click()
  const modelSection = page.locator('section').filter({
    has: page.getByRole('heading', { name: 'Model configuration' }),
  })
  await page.getByLabel('Model choice').selectOption('custom')
  await page.getByLabel('Model ID / name (if custom)').fill('gpt-test-model')
  await modelSection.getByLabel('Notes').fill('Performance acceptance run.')
  await page.getByRole('button', { name: 'Save model config' }).click()
  await expect(page.getByText('Configuration saved.')).toBeVisible()

  // Chat tab
  await page.getByRole('button', { name: /Chat history/i }).click()
  const chatSection = page.locator('section').filter({
    has: page.getByRole('heading', { name: 'Chat history' }),
  })
  await page.getByLabel('Persistence').selectOption('persisted')
  await page.getByLabel('Retention (days)').fill('30')
  await chatSection.getByLabel('Notes').fill('Retain for analytics.')
  await page.getByRole('button', { name: 'Save chat history config' }).click()
  await expect(page.getByText('Configuration saved.')).toBeVisible()

  // Data source tab
  await page.getByRole('button', { name: /Data source/i }).click()
  await page.getByLabel('Ingestion approach (config only)').selectOption('ingestion_api')
  await page.getByLabel('Formats (comma-separated)').fill('PDF, CSV, JSON')
  await page.getByLabel('Max file size (MB)').fill('50')
  await page.getByLabel('Source systems notes').fill('Content is exported nightly.')
  await page.getByLabel('Metadata creation mechanism').fill('Generated from CMS export.')
  await page.getByLabel('Metadata ownership').fill('Ops Team')
  await page.getByLabel('Metadata scope').fill('All premium reports')
  await page.getByRole('button', { name: 'Save data source config' }).click()
  await expect(page.getByText('Configuration saved.')).toBeVisible()

  // Metadata fields tab
  await page.getByRole('button', { name: /Metadata fields/i }).click()

  for (let i = 0; i < 3; i += 1) {
    const fieldName = trackedFieldName(i)
    await page.getByLabel('Brand field name').fill(fieldName)
    await page.getByLabel('Attribute key (camelCase)').fill(`testFieldName${TRACKING_SEQUENCE[i]}${stamp}`)
    await page.getByLabel('Type').selectOption(i % 2 === 0 ? 'string' : 'boolean')
    await page.getByLabel('Description').fill(`Generated field ${i + 1}`)
    await page.getByRole('button', { name: 'Add mapping' }).click()
    await expect(page.getByText(fieldName)).toBeVisible()
  }

  await expect(page.getByText(trackedFieldName(0))).toBeVisible()
  await expect(page.getByText(trackedFieldName(1))).toBeVisible()

  // Upselling tab
  await page.getByRole('button', { name: /Upselling/i }).click()
  await page.getByLabel('Upselling enabled').check()
  await page.getByLabel('Modal copy').fill('Upgrade for deep insights')
  await page.getByLabel('CTA text').fill('Upgrade now')
  await page.getByLabel('Business rules').fill('Show for anonymous users after 3 prompts.')
  await page.getByLabel('Offer data source').selectOption('static')
  await page.getByLabel('Compliance notes').fill('Reviewed by legal in QA environment.')
  await page.getByRole('button', { name: 'Save upselling config' }).click()
  await expect(page.getByText('Configuration saved.')).toBeVisible()

  // Integration tab
  await page.getByRole('button', { name: /Integration \(placeholders\)/i }).click()
  await page.getByLabel('Auth pattern').selectOption('wrapper')
  await page.getByLabel('Cognito pool domain').fill('example.auth.region.amazoncognito.com')
  await page.getByLabel('Cognito client ID').fill(`client-${stamp}`)
  await page.getByLabel('Client secret reference').fill('secret://qa/cognito/client')
  await page.getByLabel('S3 bucket').fill('elysia-onboarding-test-bucket')
  await page.getByLabel('S3 prefix').fill('onboarding/test')
  await page.getByLabel('Collection name').fill(`collection-${stamp}`)
  await page.getByLabel('Knowledge base ID').fill(`kb-${stamp}`)
  await page.getByLabel('Knowledge base name').fill('KB Test')
  await page.getByLabel('Query builder notes').fill('Default query tuning.')
  await page.getByLabel('Brand prompts').fill('Prompt A, Prompt B')
  await page.getByRole('button', { name: 'Save integration placeholders' }).click()
  await expect(page.getByText('Configuration saved.')).toBeVisible()

  // Documentation check
  await page.getByRole('link', { name: 'Documentation' }).click()
  await expect(page).toHaveURL(/\/documentation\//)
  await page.getByRole('link', { name: 'API reference', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'API reference' })).toBeVisible()

  // Cleanup: delete brand (direct URL — test brands are hidden on the list by default)
  await page.goto(brandEditPath)
  await expect(page.getByRole('heading', { name: brandName })).toBeVisible()
  await page.getByRole('button', { name: 'Delete brand' }).click()
  const deleteDialog = page.getByRole('dialog', { name: 'Delete brand' })
  await expect(deleteDialog).toBeVisible()
  await deleteDialog.getByRole('button', { name: 'Delete brand' }).click()
  await expect(page).toHaveURL('/')
})
