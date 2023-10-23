import { Divider, Heading, VStack } from '@chakra-ui/react'
import React from 'react'

type SideBarSectionProps = {
    separator?: boolean
    title?: string
    children: React.ReactNode
}

export const SideBarSection: React.FC<SideBarSectionProps> = (props) => {

	return <>
        <VStack alignItems='flex-start' w='100%' gap='1rem'>

            {props.title &&
                <Heading as='h3'
                    fontSize='.9rem'
                    textTransform='uppercase'
                    fontWeight='bold'
                    color='primary.50'
                    mb='.5rem'
                >
                    {props.title}
                </Heading>
            }

            {props.children}
        </VStack>

        {props.separator !== false && <Divider my='2rem' />}
    </>
}
