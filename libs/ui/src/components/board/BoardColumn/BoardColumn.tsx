import { Box, Heading } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { BaseBoardCardType, BoardColumnType } from '../../../utils'
import { BoardCard } from '../BoardCard/BoardCard'

type BoardColumnProps<TData extends BaseBoardCardType> = BoardColumnType<TData> & {
    renderCard: (card: TData) => JSX.Element
}

export function BoardColumn<TData extends BaseBoardCardType>(props: BoardColumnProps<TData>) {

    const { setNodeRef } = useDroppable({ id: props.id })

	return (
        <SortableContext 
            id={props.id}
            items={props.cards}
            strategy={rectSortingStrategy}
        >
            <Box
                ref={setNodeRef}
                w='200px'
                bg='secondary'
                mr='10px'
            >
                <Heading as='h3'>{props.title}</Heading>
                {props.cards.map((card) => (
                    <BoardCard key={card.id} id={card.id} data={card} renderCard={props.renderCard} />
                ))}

            </Box>

        </SortableContext>
    )
}