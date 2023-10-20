import { ChakraProps } from '@chakra-ui/react'
import { UniqueIdentifier } from '@dnd-kit/core'
import { Dispatch, ReactNode, SetStateAction } from 'react'
import { DropResult } from 'react-beautiful-dnd'

// Types

export type BoardColumnType<TData extends BaseBoardCardType> = {
	id: number
	title: string
	cards: TData[]
	meta?: any
}

export type BaseBoardCardType = {
	id: number
	title: ReactNode
    isLoading: boolean
}

export type Collapsable = {
	collapsed: boolean
	setCollapsed: Dispatch<SetStateAction<UniqueIdentifier[]>>
}

export type BaseBoardColumnProps<TData extends BaseBoardCardType> = {
    column: BoardColumnType<TData>
    renderCard?: (card: TData) => JSX.Element
    collapsable?: {
        columns?: boolean
        cards?: boolean
    }
}

export type OnCardMoveSignature<TData extends BaseBoardCardType> = (data: {
    card: TData
    to: {
        column: BoardColumnType<TData>
        index: number
    }
    from: {
        column: BoardColumnType<TData>
        index: number
    }
    isChangingLane: boolean
}) => void

// Data

export const CUSTOM_FIRST_COLUMN_ID = -1

// Functions

export const getColumnStyleProps = (
	column: BoardColumnType<any>,
	style?:
		| ChakraProps
		| ((column: BoardColumnType<any>) => ChakraProps | undefined)
) => {
	if (!style) return {}

	if (typeof style === 'function') return style(column) || {}
	else return style
}

export const getCardStyleProps = <TData extends BaseBoardCardType>(
	card: TData,
	style?: ChakraProps | ((card: TData) => ChakraProps | undefined)
) => {
	if (!style) return {}

	if (typeof style === 'function') return style(card) || {}
	else return style
}

export const onDragEnd = <TData extends BaseBoardCardType>(
    result: DropResult, 
    columns: BoardColumnType<TData>[], 
    setColumns: Dispatch<SetStateAction<BoardColumnType<TData>[] | undefined>>,
    onCardMoveHandler?: OnCardMoveSignature<TData>
) => {

    if (!result.destination) return
	const { source, destination } = result
    
    const sourceId = parseInt(source.droppableId)
    const destId = parseInt(destination.droppableId)
    
	if (sourceId !== destId) {
        // Changing lane

		const sourceColumn = columns.find((column) => column.id === sourceId)
		const destColumn = columns.find((column) => column.id === destId)
        if (!sourceColumn || !destColumn) return

		const sourceItems = [...sourceColumn.cards]
		const destItems = [...destColumn.cards]
		
        const [removed] = sourceItems.splice(source.index, 1)
        if (
            sourceColumn.id === CUSTOM_FIRST_COLUMN_ID
            || destColumn.id === CUSTOM_FIRST_COLUMN_ID    
        ) removed.isLoading = true

		destItems.splice(destination.index, 0, removed)

        setColumns((prev) => prev?.map((column) => {
            if (column.id === sourceId) return { ...column, cards: sourceItems }
            else if (column.id === destId) return { ...column, cards: destItems }
            else return column
        }))

        if (onCardMoveHandler) {
            onCardMoveHandler({
                card: sourceColumn.cards[source.index],
                to: {
                    column: destColumn,
                    index: destination.index,
                },
                from: {
                    column: sourceColumn,
                    index: source.index,
                },
                isChangingLane: true,
            })
        }

	} else {
        // Changing position in the same lane

		const column = columns.find((column) => column.id === sourceId)
        if (!column) return

		const copiedItems = [...column.cards]
		const [removed] = copiedItems.splice(source.index, 1)

        copiedItems.splice(destination.index, 0, removed)

        setColumns((prev) => prev?.map((column) => {
            if (column.id === sourceId) return { ...column, cards: copiedItems }
            else return column
        }))

        if (onCardMoveHandler) {
            onCardMoveHandler({
                card: column.cards[source.index],
                to: {
                    column,
                    index: destination.index,
                },
                from: {
                    column,
                    index: source.index,
                },
                isChangingLane: false,
            })
        }
	
	}
}
