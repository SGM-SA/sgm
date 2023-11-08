import { HStack, Stat as ChakraStat, StatArrow, StatHelpText, StatLabel, StatNumber, Text, ChakraProps, Box } from '@chakra-ui/react'
import React from 'react'

type StatProps = {
    label: string
    value: number
    subTitle?: string
    evolution?: number
} & ChakraProps

export const Stat: React.FC<StatProps> = ({ label, value, subTitle, evolution, ...chakraProps }) => {

	return  <ChakraStat w='7.5em' {...chakraProps}>
        <StatLabel>{label}</StatLabel>
        {subTitle && <Text fontSize='.8em' opacity='0.5'>{subTitle}</Text>}
        <HStack alignItems='flex-end'>
            <StatNumber>{value}</StatNumber>
            {evolution !== undefined ?
                <StatHelpText ml='1em'>
                    <StatArrow type={evolution > 0 ? 'increase' : 'decrease'} />
                    {evolution}%
                </StatHelpText>
                :
                <Box></Box>
            }
        </HStack>
    </ChakraStat>
}