import { ChakraProps, HStack } from '@chakra-ui/react'
import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { BaseBoardCardType, BaseBoardColumnProps, BoardColumnType, OnCardMoveSignature, getCardStyleProps, getColumnStyleProps, onDragEnd } from '../../../utils'
import { BoardCard } from '../BoardCard/BoardCard'
import { BoardColumn } from '../BoardColumn/BoardColumn'

type BoardProps<TData extends BaseBoardCardType> = {
	/**
	 * Column data
	 */
	columns: BoardColumnType<TData>[]
	setColumns: React.Dispatch<React.SetStateAction<BoardColumnType<TData>[] | undefined>>
	/**
	 * Callback for when a card is moved
	 * @param card The card that was moved
	 * @param to The column and index the card was moved to
	 */
	onCardMove?: OnCardMoveSignature<TData>
  /**
   * Custom render components
   * @optional
   */
  custom?: {
    firstColumn: React.FC<BaseBoardColumnProps<TData>>
    cardBody?: (card: TData) => JSX.Element
    columnHeader?: (column: BoardColumnType<TData>) => JSX.Element
    columnFooter?: (column: BoardColumnType<TData>) => JSX.Element
  }
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

	const FirstColumnComponent = props.custom?.firstColumn

	return (
		<DragDropContext
            onDragEnd={result => onDragEnd(result, props.columns, props.setColumns, props.onCardMove)}
		>
			<HStack w='100%' gap='1em' overflowX='scroll' alignItems='flex-start'>

				{props.columns.map((column, index) => (

					index === 0 && FirstColumnComponent !== undefined ?
						<FirstColumnComponent
							key={column.id}
							column={column}
							renderCard={props.custom?.cardBody}
							collapsable={props.collapsable}
						/>
						:
						<BoardColumn<TData>
							key={column.id}
							column={column}
							custom={{
                header: props.custom?.columnHeader,
                footer: props.custom?.columnFooter
              }}
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
									renderCardBody={props.custom?.cardBody}
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
