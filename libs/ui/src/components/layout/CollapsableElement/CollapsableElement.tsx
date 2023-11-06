import { Box, ChakraProps, HStack } from '@chakra-ui/react'
import React from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

type CollapsableProps = {
    title: React.ReactNode
    children: React.ReactNode
    collapsable?: boolean
} & ChakraProps

export const CollapsableElement: React.FC<CollapsableProps> = ({ title, children, collapsable = true, ...chakraProps }) => {

    const [collapsed, setCollapsed] = React.useState<boolean>(false)
    
    const shouldDisplayBody = !collapsable || !collapsed

	return <>
        <Box {...chakraProps}>
            <HStack justifyContent='space-between' alignItems='flex-start'>
                {/* Title */}
                <Box>{title}</Box>

                {/* Collapse button */}
                {collapsable &&
                    (collapsed ?
                        <FaChevronDown onClick={e => setCollapsed(false)} cursor='pointer'/>
                        :
                        <FaChevronUp onClick={e => setCollapsed(true)} cursor='pointer'/>
                    )
                }
            </HStack>

            {shouldDisplayBody && 
                children
            }
        </Box>
    </>
}