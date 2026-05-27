import { useEffect, useId, useRef, type ReactNode } from 'react'
import './Modal.css'

type ModalTone = 'default' | 'danger' | 'success' | 'error' | 'info'

type Props = {
  open: boolean
  title: string
  children: ReactNode
  footer: ReactNode
  tone?: ModalTone
  passive?: boolean
  onClose: () => void
}

export default function Modal({
  open,
  title,
  children,
  footer,
  tone = 'default',
  passive = false,
  onClose,
}: Props) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    panelRef.current?.querySelector<HTMLElement>('button')?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previous?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className={`modal-overlay${passive ? ' modal-overlay--passive' : ''}`}
      onClick={passive ? undefined : onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className={`modal modal--${tone}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <h2 className="modal__title" id={titleId}>
            {title}
          </h2>
        </header>
        <div className="modal__body">{children}</div>
        <footer className="modal__footer">{footer}</footer>
      </div>
    </div>
  )
}
