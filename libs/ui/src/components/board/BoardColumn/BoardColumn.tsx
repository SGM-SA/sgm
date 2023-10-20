import { Box, ChakraProps, HStack, Heading, VStack } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { BaseBoardCardType, BoardColumnType, Collapsable } from '../../../utils'

type BoardColumnProps<TData extends BaseBoardCardType> = {
    column: BoardColumnType<TData>
    children: React.ReactNode
    renderHeader?: (column: BoardColumnType<TData>) => JSX.Element
    chakraProps?: ChakraProps
    collapse?: Collapsable
}

export function BoardColumn<TData extends BaseBoardCardType>(props: BoardColumnProps<TData>) {
    
    const { setNodeRef } = useDroppable({ id: props.column.id })
    
    const toggleCollapse = () => {
        if (props.collapse === undefined) return

        props.collapse.setCollapsed(prevState => {
            return props.collapse?.collapsed === false ?
            [...prevState, props.column.id]
            :
            prevState.filter((id) => id !== props.column.id)
        })
    }

    const isCollapsed = props.collapse?.collapsed ?? false

    if (isCollapsed) {
        return <>
            <VStack
                minH='80vh'
                bg='gray.100'
                width='2em'
                padding='1em'
            >
                <FaChevronRight onClick={toggleCollapse} cursor='pointer'/>
                <Heading
                    as='h3'
                    fontSize='1em'
                    userSelect='none'
                    css={{
                        writingMode: 'vertical-rl',
                    }}
                >
                    {props.column.title}
                </Heading>
            </VStack>
        </>
    } else {

        return (
            <SortableContext 
                id={String(props.column.id)}
                items={props.column.cards}
                strategy={rectSortingStrategy}
            >
                <Box
                    ref={setNodeRef}
                    width='400px'
                    minHeight='80vh'
                    bg='gray.100'
                    padding='1em'
                    borderRadius='5px'
                    {...props.chakraProps}
                >
                    {/* Header */}
                    <VStack>
                        {props.renderHeader !== undefined ? 
                            props.renderHeader(props.column)
                            :
                            <HStack w='100%' justifyContent='space-between'>
                                <Heading as='h3' fontSize='1em'>{props.column.title}</Heading>
                                <FaChevronLeft onClick={toggleCollapse} cursor='pointer'/>
                            </HStack>
                        }
                    </VStack>
                    
                    {/* Cards */}
                    {!isCollapsed && props.children}

                </Box>

            </SortableContext>
        )
    }
}