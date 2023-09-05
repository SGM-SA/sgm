import { Paginated, Result } from '@sgm/utils'

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

export type MetaBase<TData extends Types> = {
    editable: false
} | ({
    editable: true
} & MetaEditable<TData>)

export const createMeta = <TData extends Types>(options: MetaBase<TData>) => {
    return options
}

export const resolveResults = <TData>(data?: Paginated<TData> | Array<TData>) => {

    if (!data) return []
    else if (Array.isArray(data)) return data
    else return data.results || []
}