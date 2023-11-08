import { HStack, Icon, Spinner, Text, VStack } from '@chakra-ui/react'
import { useApiAffairesNumsRetrieve } from '@sgm/openapi'
import { Stat } from '@sgm/ui'
import React from 'react'
import { TbReload } from 'react-icons/tb'

type AffaireStatsProps = {
    numAffaire: number
}

export const AffaireStats: React.FC<AffaireStatsProps> = (props) => {

    const { data, isLoading, isFetching, refetch } = useApiAffairesNumsRetrieve({ pathParams: { numAffaire: props.numAffaire } })

	return <>
        <VStack 
            mt='auto'  
            alignItems='flex-start' 
            spacing='1em' 
            // padding='1em'
            // backgroundColor='secondary.100'
            // color='black' 
            // borderRadius='md'
        >
            <HStack>
                <Text fontWeight='bold'>    Statistiques</Text>
                {isFetching ? 
                    <Spinner opacity='0.5' size='xs'/>
                    :
                    <Icon as={TbReload} onClick={() => refetch()} cursor='pointer' opacity='0.5'/>
                }
            </HStack>
            
            {isLoading && <Spinner />}
            {data && <>
                    <HStack alignItems='flex-start' spacing='2em'>
                        <Stat
                            label='Nb. fiches'
                            value={data.nombre_fiches}
                        />
                        
                        <Stat 
                            label='Temps machine'
                            value={data.temps_machine}
                        />

                        <Stat 
                            label='Temps ajustage'
                            value={data.temps_ajustage}
                        />

                        <Stat 
                            label='Temps restant'
                            value={data.temps_restant}
                        />

                        <Stat 
                            label='Délais'
                            value={data.date_rendu}
                        />

                        
                        <Stat 
                            label='Coût affaire'
                            value={data.cout_affaire}
                        />
                    </HStack>
            </>}
            <VStack h='100%'>
                
            </VStack>

        </VStack>
    </>
}