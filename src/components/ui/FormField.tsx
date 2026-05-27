import type { ReactNode } from 'react'
import './FormField.css'

type FormFieldProps = {
  label: string
  hint?: string
  children: ReactNode
  htmlFor?: string
}

export default function FormField({
  label,
  hint,
  children,
  htmlFor,
}: FormFieldProps) {
  return (
    <label className="field" htmlFor={htmlFor}>
      <span className="field__label">{label}</span>
      {children}
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  )
}
