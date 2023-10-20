import { Flex } from '@chakra-ui/react'
import { DndContext, DragEndEvent, DragOverEvent, KeyboardSensor, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useState } from 'react'
import { BaseBoardCardType, BoardColumnType } from '../../../utils'
import { BoardColumn } from '../BoardColumn/BoardColumn'

type BoardProps<TData extends BaseBoardCardType> = {
	initialData: BoardColumnType<TData>[]
    renderCard: (card: TData) => JSX.Element
	onCardMove?: (card: TData, to: {
		column: BoardColumnType<TData>
		index: number
	}) => void
}

export function Board<TData extends BaseBoardCardType>(props: BoardProps<TData>) {

	const [columns, setColumns] = useState(props.initialData)

	const findColumn = (unique: string | null) => {

		if (!unique) return null
        if (columns.some((column) => column.id === unique)) return columns.find((c) => c.id === unique) ?? null

		const id = String(unique)
		const itemsWithColumnsId = columns.flatMap((column) => {
			const columnId = column.id
			return column.cards.map((card) => ({ itemId: card.id, columnId: columnId }))
		})

		const columnId = itemsWithColumnsId.find(({ itemId }) => String(itemId) === id)?.columnId
		
        return columns.find((column) => column.id === columnId) ?? null
	}

	const handleDragOver = (event: DragOverEvent) => {

		const { active, over, delta } = event

		const activeId = String(active.id)
		const overId = over ? String(over.id) : null
		const activeColumn = findColumn(activeId)
		const overColumn = findColumn(overId)
		if (!activeColumn || !overColumn || activeColumn === overColumn) return null

		setColumns((prevState) => {

			const activeItems = activeColumn.cards
			const overItems = overColumn.cards
			const activeIndex = activeItems.findIndex((item) => String(item.id) === activeId)
			const overIndex = overItems.findIndex((item) => String(item.id) === overId)

			const newIndex = () => {
				const putOnBelowLastItem =
					overIndex === overItems.length - 1 && delta.y > 0
				const modifier = putOnBelowLastItem ? 1 : 0
				return overIndex >= 0
					? overIndex + modifier
					: overItems.length + 1
			}

			return prevState.map((column) => {

				if (column.id === activeColumn.id) {
					column.cards = activeItems.filter((item) => String(item.id) !== activeId)
					return column
				} else if (column.id === overColumn.id) {
					column.cards = [
						...overItems.slice(0, newIndex()),
						activeItems[activeIndex],
						...overItems.slice(newIndex(), overItems.length),
					]
					return column
				} else {
					return column
				}
			})
		})
	}

	const handleDragEnd = (event: DragEndEvent) => {

		const { active, over } = event

		const activeId = String(active.id)
		const overId = over ? String(over.id) : null
		const activeColumn = findColumn(activeId)
		const overColumn = findColumn(overId)
		if (!activeColumn || !overColumn || activeColumn !== overColumn) return null
        
		const activeIndex = activeColumn.cards.findIndex((card) => String(card.id) === activeId)
		const overIndex = overColumn.cards.findIndex((card) => String(card.id) === overId)

		if (props.onCardMove) {
			props.onCardMove(activeColumn.cards[activeIndex], {
				column: activeColumn,
				index: activeIndex,
			})
		}
		
        if (activeIndex !== overIndex) {

			setColumns(prevState => prevState.map((column) => {

				if (column.id === activeColumn.id) {
					column.cards = arrayMove(
						overColumn.cards,
						activeIndex,
						overIndex
					)	
				}
				return column
			}))
		}
	}

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
		>
			<Flex p='20px'>
				{columns.map((column) => (
					<BoardColumn<TData>
						key={column.id}
						{...column}
                        renderCard={props.renderCard}
					/>
				))}
			</Flex>
		</DndContext>
	)
}
