import { Button, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { fetchApiModelesFichesCopyCreate, useApiAffairesNumsList } from '@sgm/openapi'
import { Select } from 'chakra-react-select'
import React, { useState } from 'react'
import { BiSolidCopy } from 'react-icons/bi'
import { toast } from 'react-toastify'

type CopyFicheModeleProps = {
    modeleId: number
}

export const CopyFicheModele: React.FC<CopyFicheModeleProps> = (props) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedAffaire, setSelectedAffaire] = useState<number | null>(null)

    const { data } = useApiAffairesNumsList(
        { queryParams: { per_page: 1000 } }, 
        { 
            enabled: isOpen, 
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: true,
        }
    )

    const handleAddModele = () => {
        if (selectedAffaire === null) return

        fetchApiModelesFichesCopyCreate({
            queryParams: {
                affaire: selectedAffaire,
                modele: props.modeleId,
            }
        })
            .then(() => {
                onClose()
                toast.success('Fiche modèle copiée')
            })
            .catch(() => {
                toast.error('Erreur lors de la copie de la fiche modèle')
            })
    }

	return <>
    
        <Button 
            variant='unstyled'
            onClick={onOpen}    
        >
            <Icon as={BiSolidCopy}
                fontSize='1.5em'
                color='green'
            />
        </Button>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Modèle
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>

                    <Select 
                        placeholder='Choisir une affaire'
                        options={data?.results?.map(affaire => ({
                            label: affaire.num_affaire,
                            value: affaire.id, 
                        }))}
                        onChange={(data) => {
                            setSelectedAffaire(data?.value ?? null)
                        }}
                    />
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme='blue' 
                        mr={3} 
                        onClick={() => {
                            handleAddModele()
                            onClose()
                        }}
                        isDisabled={selectedAffaire === null}
                    >
                        Ajouter
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
}