import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import Modal from '@/components/ui/Modal/Modal'

type AlertTone = 'info' | 'success' | 'error'

type ConfirmOptions = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'default' | 'danger'
}

type AlertOptions = {
  title: string
  message: string
  tone?: AlertTone
  confirmLabel?: string
  autoCloseMs?: number
}

type ModalRequest =
  | {
      kind: 'confirm'
      options: ConfirmOptions
      resolve: (confirmed: boolean) => void
    }
  | {
      kind: 'alert'
      options: AlertOptions
      resolve: () => void
    }

type ModalContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>
  alert: (options: AlertOptions) => Promise<void>
}

const ModalContext = createContext<ModalContextValue | null>(null)

function ModalHost({
  request,
  onClose,
}: {
  request: ModalRequest
  onClose: (result: boolean) => void
}) {
  const autoCloseRef = useRef<number | null>(null)

  useEffect(() => {
    if (request.kind !== 'alert') return
    const ms = request.options.autoCloseMs
    if (!ms || ms <= 0) return
    autoCloseRef.current = window.setTimeout(() => onClose(true), ms)
    return () => {
      if (autoCloseRef.current !== null) {
        window.clearTimeout(autoCloseRef.current)
      }
    }
  }, [request, onClose])

  if (request.kind === 'confirm') {
    const { options } = request
    const isDanger = options.tone === 'danger'
    return (
      <Modal
        open
        title={options.title}
        tone={isDanger ? 'danger' : 'default'}
        onClose={() => onClose(false)}
        footer={
          <>
            <button
              className="btn"
              type="button"
              onClick={() => onClose(false)}
            >
              {options.cancelLabel ?? 'Cancel'}
            </button>
            <button
              className={`btn${isDanger ? ' btn--danger' : ' btn--primary'}`}
              type="button"
              onClick={() => onClose(true)}
            >
              {options.confirmLabel ?? 'Confirm'}
            </button>
          </>
        }
      >
        <p>{options.message}</p>
      </Modal>
    )
  }

  const { options } = request
  const tone = options.tone ?? 'info'
  const passive = tone === 'success'

  return (
    <Modal
      open
      title={options.title}
      tone={tone === 'error' ? 'error' : tone === 'success' ? 'success' : 'info'}
      passive={passive}
      onClose={() => onClose(true)}
      footer={
        <button
          className={`btn${tone === 'success' ? ' btn--primary' : ''}`}
          type="button"
          onClick={() => onClose(true)}
        >
          {options.confirmLabel ?? 'OK'}
        </button>
      }
    >
      <p>{options.message}</p>
    </Modal>
  )
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<ModalRequest | null>(null)

  const close = useCallback((result: boolean) => {
    setRequest((current) => {
      if (!current) return null
      if (current.kind === 'confirm') {
        current.resolve(result)
      } else {
        current.resolve()
      }
      return null
    })
  }, [])

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setRequest({ kind: 'confirm', options, resolve })
    })
  }, [])

  const alert = useCallback((options: AlertOptions) => {
    return new Promise<void>((resolve) => {
      setRequest({ kind: 'alert', options, resolve })
    })
  }, [])

  const value = useMemo(() => ({ confirm, alert }), [confirm, alert])

  return (
    <ModalContext.Provider value={value}>
      {children}
      {request && <ModalHost request={request} onClose={close} />}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return ctx
}
