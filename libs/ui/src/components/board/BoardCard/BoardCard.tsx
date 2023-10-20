import { Box, ChakraProps } from '@chakra-ui/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BaseBoardCardType, Collapsable } from '../../../utils'

type BoardCardProps<TData extends BaseBoardCardType> = {
    card: TData
    renderCard: (card: TData) => JSX.Element
    collapse?: Collapsable
    chakraProps?: ChakraProps
}

export function BoardCard<TData extends BaseBoardCardType>(props: BoardCardProps<TData>) {

    const id = props.card.id

    const { attributes, listeners, setNodeRef, transform } = useSortable({ id })

	return <>
        <Box ref={setNodeRef} {...attributes} {...listeners}
            m='1em' p='1em'
            opacity={1}
            bg='gray.300'
            borderRadius='5px'
            transform={CSS.Transform.toString(transform)}
            {...props.chakraProps}
        >
            {props.renderCard(props.card)}
        </Box>
    </>
}