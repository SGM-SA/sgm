import { ChakraProps, HStack } from '@chakra-ui/react'
import { UniqueIdentifier } from '@dnd-kit/core'
import { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { BaseBoardCardType, BoardColumnType, getCardStyleProps, getColumnStyleProps, onDragEnd } from '../../../utils'
import { BoardCard } from '../BoardCard/BoardCard'
import { BoardColumn } from '../BoardColumn/BoardColumn'

type BoardProps<TData extends BaseBoardCardType> = {
	/**
	 * Column data
	 */
	columns: BoardColumnType<TData>[]
	/**
	 * Callback for when a card is moved
	 * @param card The card that was moved
	 * @param to The column and index the card was moved to
	 */
	onCardMove?: (card: TData, to: {
		column: BoardColumnType<TData>
		index: number
	}) => void
	/**
	 * Render the card body
	 * @optional
	 */
	renderCardBody?: (card: TData) => JSX.Element
	/**
	 * Render the column header
	 * @optional
	 */
	renderColumnHeader?: (column: BoardColumnType<TData>) => JSX.Element
	/**
	 * Collapse columns and/or cards
	 * @optional
	 */
	collapsable?: {
		columns?: boolean
		cards?: boolean
	}
	/**
	 * Pin the first column to the left of the screen
	 * @optional
	 */
	pinFirstColumn?: boolean
	/**
	 * Dynamic styling for columns and cards
	 * @optional
	 */
	styling?: {
		column?: ChakraProps | ((column: BoardColumnType<TData>) => ChakraProps | undefined)
		card?: ChakraProps | ((card: TData) => ChakraProps | undefined)
	}
}

export function Board<TData extends BaseBoardCardType>(props: BoardProps<TData>) {

	const [columns, setColumns] = useState(props.columns)
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
