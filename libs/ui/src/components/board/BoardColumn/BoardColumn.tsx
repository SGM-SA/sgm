import { Box, ChakraProps, HStack, Heading, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { BaseBoardCardType, BoardColumnType, cardBorderStyle } from '../../../utils'

type BoardColumnProps<TData extends BaseBoardCardType> = {
    column: BoardColumnType<TData>
    children: React.ReactNode
    custom?: {
      header?: (column: BoardColumnType<TData>) => JSX.Element
      footer?: (column: BoardColumnType<TData>) => JSX.Element
    }
    chakraProps?: ChakraProps
    collapsable?: boolean
}

export function BoardColumn<TData extends BaseBoardCardType>(props: BoardColumnProps<TData>) {

    const [collapsed, setCollapsed] = useState<boolean>(false)

    const isCollapsed = !props.collapsable ? false : collapsed

    if (isCollapsed) {
        return <>
            <VStack
                minH='75vh'
                width='2em'
                padding='1em'
                bg='secondary.100'
                {...cardBorderStyle}
                {...props.chakraProps}
            >
                <FaChevronRight onClick={e => setCollapsed(false)} cursor='pointer'/>
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
            <Droppable
                droppableId={String(props.column.id)}
                key={String(props.column.id)}
            >
                {(provided, snapshot) => (<VStack>
                    <Box
                        ref={provided.innerRef}
                        width='400px'
                        minWidth='400px'
                        minH='75vh' maxH='75vh'
                        bg='secondary.150'
                        padding='1em'
                        overflowX='hidden'
                        overflowY='auto'
                        opacity={snapshot.isDraggingOver ? 0.8 : 1}
                        {...cardBorderStyle}
                        {...props.chakraProps}
                        {...provided.droppableProps}
                    >
                        {/* Header */}
                        <VStack>
                            <HStack w='100%' justifyContent='space-between' mb='1em'>
                                <Heading as='h3' fontSize='1em'>{props.column.title}</Heading>
                                {props.custom?.header !== undefined && props.custom.header(props.column)}
                                {props.collapsable && <FaChevronLeft onClick={e => setCollapsed(true)} cursor='pointer'/>}
                            </HStack>
                        </VStack>

                        {/* Cards */}
                        {!isCollapsed && <>
                            {props.children}
                            {provided.placeholder}
                        </>}

                    </Box>
                        {/* Footer */}
                        <VStack justifySelf='flex-end' alignSelf='flex-start'>
                            {props.custom?.footer !== undefined && props.custom.footer(props.column)}
                        </VStack>
                </VStack>)}

            </Droppable>
        )
    }
}
