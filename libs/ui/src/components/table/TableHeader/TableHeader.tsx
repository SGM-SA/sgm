import { Box, Flex, Text } from '@chakra-ui/react'
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
            p='2em'
        >
            {props.title && 
                <Text as='h2'
                    display='flex'
                    alignItems='center' 
                    fontSize='xl'
                    fontWeight='normal'
                    mr='auto'
                >
                    {props.title}
                </Text>
            }
            {props.children}
        </Flex>
    </>
}