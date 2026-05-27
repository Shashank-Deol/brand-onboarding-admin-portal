# UI automation tests (Playwright)

This folder contains automated UI smoke tests for the onboarding admin portal.

## What is covered

- create new brand
- fill and save each tab section
- add metadata fields with tracked names
- open documentation pages
- cleanup by deleting created test brand

## Tracking sequence

The smoke test keeps this requested sequence in code:

`1,22,3,4,4,5`

It is used for generated metadata field names:

- `test_fieldname+1`
- `test_fieldname+22`
- `test_fieldname+3`

## Run

From `frontend/`:

```bash
npx playwright install chromium
npm run test:e2e
```

Optional:

```bash
npm run test:e2e:headed
npm run test:e2e:ui
```
