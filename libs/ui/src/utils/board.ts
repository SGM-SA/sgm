import { ChakraProps } from "@chakra-ui/react"

export type BoardColumnType<TData extends BaseBoardCardType> = {
    id: string
    title: string
    cards: TData[]
    meta?: any
}

export type BaseBoardCardType = {
    id: number
}

export const getColumnStyleProps = (column: BoardColumnType<any>, style?: ChakraProps | ((column: BoardColumnType<any>) => ChakraProps | undefined)) => {
    if (!style) return {}

    if (typeof style === 'function') return style(column) || {}
    else return style
}

export const getCardStyleProps = <TData extends BaseBoardCardType>(card: TData, style?: ChakraProps | ((card: TData) => ChakraProps | undefined)) => {
    if (!style) return {}

    if (typeof style === 'function') return style(card) || {}
    else return style
}