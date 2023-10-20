import { ChakraProps, HStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { BaseBoardCardType, BaseBoardColumnProps, BoardColumnType, getCardStyleProps, getColumnStyleProps, onDragEnd } from '../../../utils'
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
	 * 
	 */
	firstColumnComponent?: React.FC<BaseBoardColumnProps<TData>>
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

	const { firstColumnComponent: FirstColumnComponent } = props

	return (
		<DragDropContext
            onDragEnd={result => onDragEnd(result, columns, setColumns, props.onCardMove)}
		>
			<HStack w='100%' gap='1em' overflowX='scroll'>

				{columns.map((column, index) => (
					
					index === 0 && FirstColumnComponent !== undefined ?
						<FirstColumnComponent 
							key={column.id}
							column={column}
							renderCard={props.renderCardBody}
							collapsable={props.collapsable}
						/>
						:
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
							collapsable={props.collapsable?.columns}
						>

							{column.cards.map((card, index) => (
								<BoardCard 
									key={card.id}
									card={card} 
									index={index}
									renderCardBody={props.renderCardBody}
									chakraProps={getCardStyleProps(card, props.styling?.card)}
									collapse={props.collapsable?.cards}
								/>
							))}
						</BoardColumn>
				))}
			</HStack>
		</DragDropContext>
	)
}
