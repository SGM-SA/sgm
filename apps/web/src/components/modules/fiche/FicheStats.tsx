import { HStack, Icon, Spinner, Text, VStack } from '@chakra-ui/react'
import { useApiFichesEtapesRetrieve } from '@sgm/openapi'
import { Stat } from '@sgm/ui'
import React from 'react'
import { TbReload } from 'react-icons/tb'

type FicheStatsProps = {
    ficheId: number
}

export const FicheStats: React.FC<FicheStatsProps> = (props) => {

    const { data, isLoading, isFetching, refetch } = useApiFichesEtapesRetrieve({ pathParams: { id: props.ficheId } })

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
                        label='Coût fiche'
                        value={data.cout_fiche}
                    />

                    <Stat
                        label='Nb. étapes'
                        value={data.nombre_etapes}
                    />

                    <Stat
                        label='Temps total'
                        value={data.temps_total}
                    />

                    <Stat
                        label='Fourniture'
                        value={data.fourniture ? "Arrivées" : 'N/A'}
                    />
                </HStack>
            </>}
            <VStack h='100%'>

            </VStack>

        </VStack>
    </>
}
