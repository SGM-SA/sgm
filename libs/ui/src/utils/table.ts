import { Paginated, Result } from '@sgm/utils'
import { Column, Row } from '@tanstack/react-table'

type Types = 'text' | 'number' | 'date' | 'select' | 'boolean' | 'file'

type Correspondances = {
    'text': string
    'number': number
    'date': Date
    'select': string
    'boolean': boolean
    'file': string
}

export type Choice = string | {
    label: React.ReactNode
    value: string | number
}

export type ChoiceFn<TSchema> = (row: Row<TSchema>) => Promise<Choice[]>

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
    choices: Choice[] | ChoiceFn<any>
    /**
     * Is the value nullable
     * If true, the user can set the value to null with an additional empty select option
     * @default true
     */
    nullable?: boolean
    /**
     * Is the input disabled
     */
    disabled?: boolean
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
    /**
     * Is the input disabled
     */
    disabled?: boolean
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
    /**
     * The text to display when hovering over the cell
     */
    cellHoverText?: boolean
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

export const getMetaFromColumn = (column: Column<any>): Meta<any> | undefined => {
    return column.columnDef.meta as Meta<any>
}

export const resolveResults = <TData>(data?: Paginated<TData> | Array<TData>) => {

    if (!data) return []
    else if (Array.isArray(data)) return data
    else return data.results || []
}
