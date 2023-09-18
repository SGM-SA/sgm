import { Paginated, Result } from '@sgm/utils'
import { Column, Row } from '@tanstack/react-table'

type Types = 'text' | 'number' | 'date' | 'select' | 'boolean'
type Correspondances = {
    'text': string
    'number': number
    'date': Date
    'select': string
    'boolean': boolean
}

export type MetaEditable<TData extends Types> = TData extends 'select' ? {
    /**
     * The type of the editable data
     */
    type: TData
    /**
     * Custom validation function to apply when editing a cell
     * The value parameter type is automatically inferred from the type field
     */
    customValidation?: (value: Correspondances[TData]) => Result<boolean>
    /**
     * The choices to display if the type is `select`
     */
    choices: string[]
} : {
    /**
     * The type of the editable data
     */
    type: TData
    /**
     * Custom validation function to apply when editing a cell
     * The value parameter type is automatically inferred from the type field
     */
    customValidation?: (value: Correspondances[TData]) => Result<boolean>
}

type MetaBase = {
    /**
     * Enables the column to be sortable
     */
    sortable?: boolean
    /**
     * Disable warning notifications for this column
     */
    disableWarnings?: boolean
}

export type Meta<TData extends Types> = ({
    /**
     * Is the column editable
     */
    editable?: false
} & MetaBase) | ({
    /**
     * Is the column editable
     */
    editable: true
} & MetaEditable<TData> & MetaBase)

export type RowSelectionActionComponentProps<TData> = React.FC<{ 
    checkedItems: Array<Row<TData>> 
    resetSelection: () => void
}>

export const createColumnMeta = <TData extends Types>(options: Meta<TData>) => {
    return options
}

export const getMetaFromColumn = (column: Column<any>): Meta<any> => {
    return column.columnDef.meta as Meta<any>
}

export const resolveResults = <TData>(data?: Paginated<TData> | Array<TData>) => {

    if (!data) return []
    else if (Array.isArray(data)) return data
    else return data.results || []
}
