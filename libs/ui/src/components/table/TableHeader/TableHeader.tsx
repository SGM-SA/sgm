import { Box, Flex } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

type TableHeaderProps = {
    title?: string
    children?: ReactNode
}

export const TableHeader: React.FC<TableHeaderProps> = (props) => {

	return <>
        <Flex 
            w='100%' 
            justifyContent='space-between'
            mb='2em'
        >
            {props.title && 
                <Box as='h2' 
                    fontSize='xl' 
                    mr='auto'
                    p='1em'
                >
                    {props.title}
                </Box>
            }
            {props.children}
        </Flex>
    </>
}