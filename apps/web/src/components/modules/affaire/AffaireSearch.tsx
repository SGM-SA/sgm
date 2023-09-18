import { Flex, HStack, Input } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import debounce from 'debounce'
import React, { BaseSyntheticEvent } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const affaireSearchFormSchema = z.object({
    search: z.string(),
    num_affaire: z.number(),
})

export type AffaireSearchFormSchema = z.infer<typeof affaireSearchFormSchema>

type AffaireSearchProps = {
    filters: AffaireSearchFormSchema
    setFilters: (data: AffaireSearchFormSchema) => void
}

export const AffaireSearch: React.FC<AffaireSearchProps> = (props) => {

    const {
        register,
        getValues
    } = useForm<AffaireSearchFormSchema>({
        resolver: zodResolver(affaireSearchFormSchema)
    })

    const onChange = (inputName: keyof AffaireSearchFormSchema) => debounce((e: BaseSyntheticEvent) => {
        props.setFilters({
            ...getValues(),
            [inputName]: e.target.value
        })
    }, 500)
    
	return <Flex
            w='100%'
            justifyContent='flex-end'
            p='1em'
        >
            <HStack>
                
                <Input 
                    placeholder='N° Affaire' 
                    type='number'
                    // size='sm'
                    {...register('num_affaire', { 
                        value: props.filters?.num_affaire,
                        onChange: onChange('num_affaire') 
                    })}
                />

                <Input 
                    placeholder='Recherche'
                    // size='sm'
                    {...register('search', { 
                        value: props.filters?.search,
                        onChange: onChange('search') 
                    })}
                />

            </HStack>
        </Flex>
}