import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  readHideTestBrandsPreference,
  writeHideTestBrandsPreference,
} from '@/config/testBrands'

type HideTestBrandsContextValue = {
  hideTestBrands: boolean
  setHideTestBrands: (hide: boolean) => void
  toggleHideTestBrands: () => void
}

const HideTestBrandsContext = createContext<HideTestBrandsContextValue | null>(
  null,
)

export function HideTestBrandsProvider({ children }: { children: ReactNode }) {
  const [hideTestBrands, setHideTestBrands] = useState(readHideTestBrandsPreference)

  useEffect(() => {
    writeHideTestBrandsPreference(hideTestBrands)
  }, [hideTestBrands])

  const toggleHideTestBrands = useCallback(() => {
    setHideTestBrands((current) => !current)
  }, [])

  const value = useMemo(
    () => ({ hideTestBrands, setHideTestBrands, toggleHideTestBrands }),
    [hideTestBrands, toggleHideTestBrands],
  )

  return (
    <HideTestBrandsContext.Provider value={value}>
      {children}
    </HideTestBrandsContext.Provider>
  )
}

export function useHideTestBrands() {
  const ctx = useContext(HideTestBrandsContext)
  if (!ctx) {
    throw new Error('useHideTestBrands must be used within HideTestBrandsProvider')
  }
  return ctx
}
