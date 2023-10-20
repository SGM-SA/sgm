import React from 'react'
import { BaseBoardCardType } from '../../../utils'
import { useSortable } from '@dnd-kit/sortable'
import { Box, ChakraProps } from '@chakra-ui/react'
import { CSS } from '@dnd-kit/utilities'

type BoardCardProps<TData extends BaseBoardCardType> = {
    id: number
    data: TData
    renderCard: (card: TData) => JSX.Element
    chakraProps?: ChakraProps
}

export function BoardCard<TData extends BaseBoardCardType>(props: BoardCardProps<TData>) {

    const { attributes, listeners, setNodeRef, transform } = useSortable({
        id: props.id,
    })

	return <>
        <Box ref={setNodeRef} {...attributes} {...listeners}
            m='1em' p='1em'
            opacity={1}
            bg='gray.300'
            borderRadius='5px'
            transform={CSS.Transform.toString(transform)}
            {...props.chakraProps}
        >
            {props.renderCard(props.data)}
        </Box>
    </>
}