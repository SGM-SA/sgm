export type BoardColumnType<TData extends BaseBoardCardType> = {
    id: string
    title: string
    cards: TData[]
}

export type BaseBoardCardType = {
    id: number
}