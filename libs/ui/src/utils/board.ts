import { ChakraProps } from "@chakra-ui/react"
import { UniqueIdentifier } from "@dnd-kit/core"
import { Dispatch, ReactNode, SetStateAction } from "react"

// Types

export type BoardColumnType<TData extends BaseBoardCardType> = {
    id: UniqueIdentifier
    title: string
    cards: TData[]
    meta?: any
}

export type BaseBoardCardType = {
    id: UniqueIdentifier
    title: ReactNode
}

export type Collapsable = {
    collapsed: boolean
    setCollapsed: Dispatch<SetStateAction<UniqueIdentifier[]>>
}

// Functions

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