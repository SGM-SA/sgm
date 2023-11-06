export type Result<TData> = 
    | { type: 'ok', data: TData }
    | { type: 'error', message: string }

export type Optional<T> = T | undefined

export const Ok = <TData>(data: TData): Result<TData> => {
    return { type: 'ok', data }
}

export const Err = (message: string): Result<never> => {
    return { type: 'error', message }
}

export const isOk = <TData>(result: Result<TData>): result is { type: 'ok', data: TData } => {
    return result.type === 'ok'
}

export const isErr = <TData>(result: Result<TData>): result is { type: 'error', message: string } => {
    return result.type === 'error'
}