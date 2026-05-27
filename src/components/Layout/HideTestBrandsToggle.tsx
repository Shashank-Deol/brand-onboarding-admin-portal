import { useHideTestBrands } from '@/context/HideTestBrandsContext'
import './HideTestBrandsToggle.css'

export default function HideTestBrandsToggle() {
  const { hideTestBrands, toggleHideTestBrands } = useHideTestBrands()

  return (
    <label className="hide-test-toggle" title="Hide brands created by Playwright automation">
      <input type="checkbox" checked={hideTestBrands} onChange={toggleHideTestBrands} />
      <span className="hide-test-toggle__track" aria-hidden />
      <span className="hide-test-toggle__label">Hide Playwright test brands</span>
    </label>
  )
}
