import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { fetchApiModelesFichesCopyCreate, useApiModelesFichesOptionsList } from '@sgm/openapi'
import React, { useState } from 'react'
import { Select } from 'chakra-react-select'

type AddFicheModeleProps = {
    affaireId: number
    refetch: () => void
}

export const AddFicheModele: React.FC<AddFicheModeleProps> = (props) => {

    const { data } = useApiModelesFichesOptionsList({})
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedModele, setSelectedModele] = useState<number | null>(null)

    const handleAddModele = () => {
        if (selectedModele === null) return

        fetchApiModelesFichesCopyCreate({
            queryParams: {
                affaire: props.affaireId,
                modele: selectedModele,
            }
        })
            .then(() => props.refetch())
            .catch(() => props.refetch())
    }

	return <Box>
        <Button
            size='sm'
            colorScheme='blue'
            variant='outline'
            onClick={onOpen}
        >
            Ajouter fiche modèle
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
                        placeholder='Choisir un modèle' 
                        options={data?.results?.map((modele) => ({ value: modele.value, label: modele.name }))}
                        onChange={(data) => {
                            setSelectedModele(data ? parseInt(data.value) : null)
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
                        isDisabled={selectedModele === null}
                    >
                        Ajouter
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </Box>
}