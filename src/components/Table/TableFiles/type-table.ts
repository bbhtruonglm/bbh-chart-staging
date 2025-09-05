import { ColumnDef } from '@tanstack/react-table'

/** Define a new type by intersecting ColumnDef with custom properties */
export type IProColumn<D> = ColumnDef<D> & {
  /** Width for mobile view */
  mobile_width?: string
  /** Width for desktop view */
  desktop_width?: string
  /** Width for tablet view */
  accessorKey?: string
  /** header */
  header?: any
  /** Label */
  label?: any
}

/** Use the new IProColumn array type */
export type IProColumns<D> = IProColumn<D>[]
