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
    type: TData
    customValidation?: (value: Correspondances[TData]) => Result<boolean>
    choices: string[]
} : {
    type: TData
    customValidation?: (value: Correspondances[TData]) => Result<boolean>
}

type MetaBase = {
    sortable?: boolean
    disableWarnings?: boolean
    // filterable?: boolean
}

export type Meta<TData extends Types> = ({
    editable?: false
} & MetaBase) | ({
    editable: true
} & MetaEditable<TData> & MetaBase)

export type RowSelectionActionComponentProps<TData> = React.FC<{ 
    checkedItems: Array<Row<TData>> 
    resetSelection: () => void
}>

export const createMeta = <TData extends Types>(options: Meta<TData>) => {
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
