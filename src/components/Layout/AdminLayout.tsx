import { NavLink, Outlet, useLocation } from 'react-router-dom'
import HideTestBrandsToggle from '@/components/Layout/HideTestBrandsToggle'
import { HideTestBrandsProvider } from '@/context/HideTestBrandsContext'
import './AdminLayout.css'

export default function AdminLayout() {
  const { pathname } = useLocation()
  const isDocumentation = pathname.startsWith('/documentation')

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <span className="admin__eyebrow">Elysia</span>
          <strong>Onboarding Admin</strong>
        </div>
        <nav className="admin__nav">
          <NavLink to="/" end>
            Brands
          </NavLink>
        </nav>
        <p className="admin__hint">
          Config-only portal. Auth, S3, Cognito, and KB integrations are stored
          as placeholders—not wired yet.
        </p>
        <footer className="admin__footer">
          <NavLink
            to="/documentation/admin-portal-guide"
            className={({ isActive }) =>
              isActive || isDocumentation ? 'admin__footer-link active' : 'admin__footer-link'
            }
          >
            Documentation
          </NavLink>
        </footer>
      </aside>
      <HideTestBrandsProvider>
        <div
          className={
            isDocumentation ? 'admin__main admin__main--wide' : 'admin__main'
          }
        >
          <header className="admin__topbar">
            <HideTestBrandsToggle />
          </header>
          <main className="admin__content">
            <Outlet />
          </main>
        </div>
      </HideTestBrandsProvider>
    </div>
  )
}
