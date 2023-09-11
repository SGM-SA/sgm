import { ChakraProps, Flex } from '@chakra-ui/react'
import React from 'react'

type CardProps = {
    center?: boolean
    children: React.ReactNode
} & ChakraProps

export const Card: React.FC<CardProps> = ({ children, center, ...props }) => {

	return <>
        <Flex
            flexDirection='column'
            alignItems={center ? 'center' : 'flex-start'}
            backgroundColor='secondary'
            borderRadius='5px'
            p='2rem'
            gap='1rem'
            {...props}
        >
            {children}
        </Flex>
    </>
}