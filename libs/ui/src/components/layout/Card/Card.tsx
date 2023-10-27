import { ChakraProps, Flex } from '@chakra-ui/react'
import React, { LegacyRef } from 'react'

type CardProps = {
  children: React.ReactNode
  center?: boolean
  ref?: LegacyRef<any>
} & ChakraProps

export const Card: React.FC<CardProps> = ({ children, center, ...props }) => {

	return <Flex
            flexDirection='column'
            alignItems={center ? 'center' : 'flex-start'}
            backgroundColor='secondary.100'
            borderRadius='5px'
            borderColor='#e6eaee'
            boxShadow='0 0 10px 0 rgba(0, 0, 0, 0.1)'
            p='2em'
            gap='1rem'
            {...props}
        >
            {children}
        </Flex>
}
