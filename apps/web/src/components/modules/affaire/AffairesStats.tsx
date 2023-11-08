import { Box, Button, Grid, HStack, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, Text, VStack, useDisclosure } from '@chakra-ui/react'
import { useApiAffairesStatsRetrieve } from '@sgm/openapi'
import { Stat } from '@sgm/ui'
import React from 'react'
import { TbReload } from 'react-icons/tb'
import { statusColors } from '../../../pages/affaires'

type AffairesStatsProps = {}

export const AffairesStats: React.FC<AffairesStatsProps> = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { data, isLoading, isFetching, refetch } = useApiAffairesStatsRetrieve({})

    const evolution = data ? (Math.round((((data.terminees_cette_semaine - data.terminees_semaine_der) / (data.terminees_semaine_der || 1)) * 100)) / 100) : 0

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
                <Text fontWeight='bold'>Statistiques</Text>
                {isFetching ? 
                    <Spinner opacity='0.5' size='xs'/>
                    :
                    <Icon as={TbReload} onClick={() => refetch()} cursor='pointer' opacity='0.5'/>
                }
            </HStack>
            
            {isLoading && <Spinner />}
            {data && <>
                    <HStack alignItems='flex-end' spacing='2em'>
                        <Stat 
                            label={<HStack><Text>Terminé</Text> <Text as='span' fontSize='.8em' opacity='0.5'>cette semaine</Text></HStack>}
                            value={data.terminees_cette_semaine}
                            evolution={evolution}
                        />
                        
                        <Stat 
                            label='En retard'
                            value={data.en_retard}
                        />

                        <Button
                            onClick={onOpen}
                            size='xs'
                        >
                            Par statut
                        </Button>
                    </HStack>
            </>}
            <VStack h='100%'>
                
            </VStack>

        </VStack>
    
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Affaires par statut
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <Grid
                        templateColumns='repeat(3, 1fr)'
                        gap={6}
                        padding='1em'
                    >
                        {data && Object.entries(data.par_statut).map(([statut, amount]) => (
                            <HStack spacing='1em' key={statut}>
                                <Box
                                    as='span'
                                    px='.75em'
                                    py='.25em'
                                    borderRadius='15px'
                                    fontSize='.8em'
                                    color={`${Object.entries(statusColors).find(([_, value]) => value.includes(statut))?.[0] || 'gray'}.700`}
                                    bg={`${Object.entries(statusColors).find(([_, value]) => value.includes(statut))?.[0] || 'gray'}.100`}
                                >
                                    {statut}
                                </Box>
                                <Text>{amount}</Text>
                            </HStack>
                        ))}
                    </Grid>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
}