import { Box, ChakraProps, Heading, VStack } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { BaseBoardCardType, BoardColumnType, getCardStyleProps } from '../../../utils'
import { BoardCard } from '../BoardCard/BoardCard'

type BoardColumnProps<TData extends BaseBoardCardType> = {
    column: BoardColumnType<TData>
    renderCard: (card: TData) => JSX.Element
    renderColumnHeader?: (column: BoardColumnType<TData>) => JSX.Element
    cardStyling?: ChakraProps | ((card: TData) => ChakraProps | undefined)
    chakraProps?: ChakraProps
}

export function BoardColumn<TData extends BaseBoardCardType>(props: BoardColumnProps<TData>) {

    const { setNodeRef } = useDroppable({ id: props.column.id })

	return (
        <SortableContext 
            id={props.column.id}
            items={props.column.cards}
            strategy={rectSortingStrategy}
        >
            <Box
                ref={setNodeRef}
                w='200px'
                minH='80vh'
                bg='gray.100'
                mr='10px'
                p='1em'
                borderRadius='5px'
                {...props.chakraProps}
            >
                {/* Header */}
                <VStack>
                    {props.renderColumnHeader !== undefined ? 
                        props.renderColumnHeader(props.column)
                        :
                        <Heading as='h3' fontSize='1.2em'>{props.column.title}</Heading>
                    }
                </VStack>
                
                {/* Cards */}
                {props.column.cards.map((card) => (
                    <BoardCard 
                        key={card.id} 
                        id={card.id} 
                        data={card} 
                        renderCard={props.renderCard}
                        chakraProps={getCardStyleProps(card, props.cardStyling)}
                    />
                ))}

            </Box>

        </SortableContext>
    )
}