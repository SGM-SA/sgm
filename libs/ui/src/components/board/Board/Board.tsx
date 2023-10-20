import { ChakraProps, HStack } from '@chakra-ui/react'
import { UniqueIdentifier } from '@dnd-kit/core'
import { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { BaseBoardCardType, BoardColumnType, getCardStyleProps, getColumnStyleProps, onDragEnd } from '../../../utils'
import { BoardCard } from '../BoardCard/BoardCard'
import { BoardColumn } from '../BoardColumn/BoardColumn'

type BoardProps<TData extends BaseBoardCardType> = {
	initialData: BoardColumnType<TData>[]
	onCardMove?: (card: TData, to: {
		column: BoardColumnType<TData>
		index: number
	}) => void
	renderCardBody?: (card: TData) => JSX.Element
	renderColumnHeader?: (column: BoardColumnType<TData>) => JSX.Element
	collapsable?: {
		columns?: boolean
		cards?: boolean
	}
	pinFirstColumn?: boolean
	// TODO: implement
	styling?: {
		column?: ChakraProps | ((column: BoardColumnType<TData>) => ChakraProps | undefined)
		card?: ChakraProps | ((card: TData) => ChakraProps | undefined)
		// TODO: faire comme pour le styling dynamique de Table
	}
}

export function Board<TData extends BaseBoardCardType>(props: BoardProps<TData>) {

	const [columns, setColumns] = useState(props.initialData)
	const [collapsedColumns, setCollapsedColumns] = useState<UniqueIdentifier[]>([])
	const [collapsedCards, setCollapsedCards] = useState<UniqueIdentifier[]>([])

	return (
		<DragDropContext
            onDragEnd={result => onDragEnd(result, columns, setColumns, props.onCardMove)}
		>
			<HStack w='100%' gap='1em' overflowX='scroll'>

				{columns.map((column, index) => (
					
					<BoardColumn<TData>
						key={column.id}
						column={column}
						renderHeader={props.renderColumnHeader}
						chakraProps={{
							...getColumnStyleProps(column, props.styling?.column),
							...(props.pinFirstColumn && index === 0 ? { 
								position: 'sticky', 
								left: 0,
								zIndex: 2
							} : {})
						}}
						collapse={props.collapsable?.columns ? {
							collapsed: collapsedColumns.includes(column.id),
							setCollapsed: setCollapsedColumns
						} : undefined}
					>

						{column.cards.map((card, index) => (
							<BoardCard 
								key={card.id} 
								card={card} 
								index={index}
								renderCardBody={props.renderCardBody}
								chakraProps={getCardStyleProps(card, props.styling?.card)}
								collapse={props.collapsable?.cards ? {
									collapsed: collapsedCards.includes(card.id),
									setCollapsed: setCollapsedCards
								} : undefined}
							/>
						))}
					</BoardColumn>
				))}
			</HStack>
		</DragDropContext>
	)
}
