import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '@/components/Layout/AdminLayout'
import { ModalProvider } from '@/context/ModalContext'
import BrandEditPage from '@/pages/BrandEditPage'
import BrandsListPage from '@/pages/BrandsListPage'
import DocumentationPage from '@/pages/DocumentationPage'

function App() {
  return (
    <ModalProvider>
      <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<BrandsListPage />} />
          <Route path="brands/new" element={<BrandEditPage />} />
          <Route path="brands/:brandId" element={<BrandEditPage />} />
          <Route path="documentation" element={<DocumentationPage />} />
          <Route path="documentation/:docSlug" element={<DocumentationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </ModalProvider>
  )
}

export default App
