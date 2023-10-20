import { ChakraProps, Text } from '@chakra-ui/react'
import React from 'react'

type TextLinkProps = {
    children: React.ReactNode
} & ChakraProps

export const TextLink: React.FC<TextLinkProps> = ({ children, ...chakraProps }) => {

	return <Text 
        as='span'
        color='blue' 
        _hover={{ textDecoration: 'underline' }}
        {...chakraProps}
    >
        {children}
    </Text>
}