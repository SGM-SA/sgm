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
    setColumns: Dispatch<SetStateAction<BoardColumnType<TData>[]>>,
    onCardMoveHandler?: (card: TData, to: { column: BoardColumnType<TData>, index: number }) => void
) => {

	if (!result.destination) return
	const { source, destination } = result

    const sourceId = parseInt(source.droppableId)
    const destId = parseInt(destination.droppableId)

    // if (props.onCardMove) {
    //     props.onCardMove(activeColumn.cards[activeIndex], {
    //         column: activeColumn,
    //         index: activeIndex,
    //     })
    // }

	if (sourceId !== destId) {

		const sourceColumn = columns.find((column) => column.id === sourceId)
		const destColumn = columns.find((column) => column.id === destId)
        if (!sourceColumn || !destColumn) return

		const sourceItems = [...sourceColumn.cards]
		const destItems = [...destColumn.cards]
		const [removed] = sourceItems.splice(source.index, 1)

		destItems.splice(destination.index, 0, removed)

        setColumns((prev) => prev.map((column) => {
            if (column.id === sourceId) return { ...column, cards: sourceItems }
            else if (column.id === destId) return { ...column, cards: destItems }
            else return column
        }))

        if (onCardMoveHandler) {
            onCardMoveHandler(sourceColumn.cards[source.index], {
                column: destColumn,
                index: destination.index,
            })
        }

	} else {

		const column = columns.find((column) => column.id === sourceId)
        if (!column) return

		const copiedItems = [...column.cards]
		const [removed] = copiedItems.splice(source.index, 1)
		
        copiedItems.splice(destination.index, 0, removed)

        setColumns((prev) => prev.map((column) => {
            if (column.id === sourceId) return { ...column, cards: copiedItems }
            else return column
        }))

        if (onCardMoveHandler) {
            onCardMoveHandler(column.cards[source.index], {
                column,
                index: destination.index,
            })
        }
	
	}
}
