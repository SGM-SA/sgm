import { Box, ChakraProps, HStack, Text } from '@chakra-ui/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { BaseBoardCardType, Collapsable } from '../../../utils'

type BoardCardProps<TData extends BaseBoardCardType> = {
    card: TData
    renderCardBody?: (card: TData) => JSX.Element
    collapse?: Collapsable
    chakraProps?: ChakraProps
}

export function BoardCard<TData extends BaseBoardCardType>(props: BoardCardProps<TData>) {

    const id = props.card.id

    const { attributes, listeners, setNodeRef, transform } = useSortable({ id })

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
        <Box ref={setNodeRef} {...attributes} {...listeners}
            m='1em' p='1em'
            opacity={1}
            bg='gray.300'
            borderRadius='5px'
            transform={CSS.Transform.toString(transform)}
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
    </>
}