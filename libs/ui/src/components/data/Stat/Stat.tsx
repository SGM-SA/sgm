import { Box, ChakraProps, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'

type StatProps = {
    label: React.ReactNode
    value: any
    subTitle?: string
    evolution?: number
} & ChakraProps

export const Stat: React.FC<StatProps> = ({ label, value, subTitle, evolution, ...chakraProps }) => {

	return  <VStack {...chakraProps} alignItems='flex-start' spacing={0}>
        <Text fontSize='.8em'>{label}</Text>
        {subTitle && <Text fontSize='.8em' opacity='0.5'>{subTitle}</Text>}
        <HStack>
            <Text fontSize='1.3em'>{value}</Text>
            {evolution !== undefined ?
                <Text ml='1em' fontSize='.9em' color={evolution > 0 ? 'green' : 'red'}>
                    {evolution > 0 ? '↑ ' : '↓ '}
                    {/* <StatArrow type={evolution > 0 ? 'increase' : 'decrease'} /> */}
                    {evolution}%
                </Text>
                :
                <Box></Box>
            }
        </HStack>
    </VStack>
}