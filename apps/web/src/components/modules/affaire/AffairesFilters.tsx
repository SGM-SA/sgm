import { Flex, HStack, Input } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { affaireStatus } from '@sgm/openapi'
import { MultiSelect } from 'chakra-multiselect'
import debounce from 'debounce'
import React, { BaseSyntheticEvent } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const affairesFiltersFormSchema = z.object({
    search: z.string(),
    num_affaire: z.number(),
    statuts: z.array(z.string())
})

export type AffairesFiltersFormSchema = z.infer<typeof affairesFiltersFormSchema>

type AffairesFiltersProps = {
    filters: AffairesFiltersFormSchema
    setFilters: (data: AffairesFiltersFormSchema) => void
}

export const AffairesFilters: React.FC<AffairesFiltersProps> = (props) => {

    const {
        register,
        getValues
    } = useForm<AffairesFiltersFormSchema>({
        resolver: zodResolver(affairesFiltersFormSchema)
    })

    const onChange = (inputName: keyof AffairesFiltersFormSchema) => debounce((e: BaseSyntheticEvent) => {
        props.setFilters({
            ...getValues(),
            [inputName]: e.target.value
        })
    }, 500)
    
	return <Flex
            w='100%'
            justifyContent='flex-end'
        >
            <HStack>

                <MultiSelect
                    placeholder='Statuts'
                    size='sm'
                    options={affaireStatus.map(status => ({ label: status, value: status }))}
                    value={props.filters?.statuts}
                    // @ts-ignore
                    onChange={(values) => onChange('statuts')({ target: { value: values } })}
                /> 
                
                <Input 
                    placeholder='N° Affaire'
                    type='number'
                    size='sm'
                    {...register('num_affaire', { 
                        value: props.filters?.num_affaire,
                        onChange: onChange('num_affaire') 
                    })}
                />

                <Input 
                    placeholder='Recherche'
                    size='sm'
                    {...register('search', { 
                        value: props.filters?.search,
                        onChange: onChange('search') 
                    })}
                />

            </HStack>
        </Flex>
}