import { Box, ChakraProps, HStack, Text } from '@chakra-ui/react'
import { Draggable } from 'react-beautiful-dnd'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { BaseBoardCardType, Collapsable } from '../../../utils'

type BoardCardProps<TData extends BaseBoardCardType> = {
    card: TData
    index: number
    renderCardBody?: (card: TData) => JSX.Element
    collapse?: Collapsable
    chakraProps?: ChakraProps
}

export function BoardCard<TData extends BaseBoardCardType>(props: BoardCardProps<TData>) {

    const toggleCollapse = () => {
        console.log('toggled')
        if (props.collapse === undefined) return

        props.collapse.setCollapsed(prevState => {
            return props.collapse?.collapsed === false ?
            [...prevState, props.card.id]
            :
            prevState.filter((id) => id !== props.card.id)
        })
    }

    const isCollapsable = props.collapse !== undefined && props.renderCardBody

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
                    borderRadius='5px'
                    {...props.chakraProps}
                >
                    {/* Header */}
                    <HStack justifyContent='space-between'>
                        {/* Title */}
                        <Text fontWeight='bold'>{props.card.title}</Text>

                        {/* Collapse button */}
                        {isCollapsable &&
                            (props.collapse?.collapsed ?
                                <FaChevronDown onClick={toggleCollapse} cursor='pointer'/>
                                :
                                <FaChevronUp onClick={toggleCollapse} cursor='pointer'/>
                            )
                        }
                    </HStack>

                    {/* Body */}
                    {(isCollapsable && !props.collapse?.collapsed) &&
                        <Box>
                            {props.renderCardBody?.(props.card)}
                        </Box>
                    }
                </Box>
            )}
        </Draggable>
    </>
}