import { useId } from 'react'
import { cx } from '@/utils/cx'
import styles from '../forms/field.module.css'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  id?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  label = 'Search',
  placeholder = 'Search',
  id,
  className,
}: SearchInputProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <div className={cx(styles.field, styles.search, className)}>
      <label className={styles.label} htmlFor={fieldId}>
        {label}
      </label>
      <input
        id={fieldId}
        type="search"
        value={value}
        placeholder={placeholder}
        className={cx(styles.control, value ? styles.searchControl : false)}
        onChange={(event) => onChange(event.target.value)}
      />
      {value ? (
        <button type="button" className={styles.clear} onClick={() => onChange('')}>
          Clear
        </button>
      ) : null}
    </div>
  )
}
