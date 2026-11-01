import type { KeyboardEvent, ReactNode } from 'react'
import { EmptyState } from '@/components/feedback/EmptyState'
import type { SortDirection } from '@/types'
import { cx } from '@/utils/cx'
import styles from './DataTable.module.css'

export interface Column<T> {
  id: string
  header: string
  cell: (row: T) => ReactNode
  sortable?: boolean
}

export interface TableSort {
  columnId: string
  direction: SortDirection
}

export interface DataTableProps<T> {
  columns: readonly Column<T>[]
  rows: readonly T[]
  getRowId: (row: T) => string
  caption: string
  sort?: TableSort
  onSortChange?: (sort: TableSort) => void
  onRowClick?: (row: T) => void
  emptyTitle?: string
  emptyDescription?: string
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  caption,
  sort,
  onSortChange,
  onRowClick,
  emptyTitle = 'Nothing to show',
  emptyDescription = 'There are no rows to display.',
}: DataTableProps<T>) {
  function requestSort(columnId: string) {
    if (!onSortChange) return
    const direction = sort?.columnId === columnId && sort.direction === 'asc' ? 'desc' : 'asc'
    onSortChange({ columnId, direction })
  }

  function onRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, row: T) {
    if (!onRowClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onRowClick(row)
    }
  }

  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => {
              const sorted = sort?.columnId === column.id ? sort.direction : undefined
              return (
                <th
                  key={column.id}
                  scope="col"
                  className={styles.th}
                  aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none'}
                >
                  {column.sortable && onSortChange ? (
                    <button type="button" className={styles.sortButton} onClick={() => requestSort(column.id)}>
                      {column.header}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className={styles.emptyCell} colSpan={columns.length}>
                <EmptyState title={emptyTitle} description={emptyDescription} />
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowId(row)}
                className={cx(styles.tr, onRowClick && styles.clickable)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={onRowClick ? (event) => onRowKeyDown(event, row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
              >
                {columns.map((column) => (
                  <td key={column.id} className={styles.td}>
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
