import { Box, ChakraProps } from '@chakra-ui/react'
import { Draggable } from 'react-beautiful-dnd'
import { BaseBoardCardType } from '../../../utils'
import { CollapsableElement } from '../../layout/CollapsableElement/CollapsableElement'


type BoardCardProps<TData extends BaseBoardCardType> = {
    card: TData
    index: number
    renderCardBody?: (card: TData) => JSX.Element
    title?: React.ReactNode
    collapse?: boolean
    chakraProps?: ChakraProps
}

export function BoardCard<TData extends BaseBoardCardType>(props: BoardCardProps<TData>) {

	return <>
        <Draggable
            key={String(props.card.id)}
            draggableId={String(props.card.id)}
            index={props.index}
        >
            {(provided, snapshot) => (
                <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                    m='1em' p='1em'
                    opacity={1}
                    bg='gray.300'
                    borderRadius='2px'
                    {...props.chakraProps}
                >
                    <CollapsableElement
                        title={props.title || props.card.title}
                        collapsable={props.collapse ?? false}
                    >
                        {props.renderCardBody?.(props.card)}
                    </CollapsableElement>
                </Box>
            )}
        </Draggable>
    </>
}