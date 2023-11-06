import { Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchApiZonesCreate } from '@sgm/openapi'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const zoneFormSchema = z.object({
    nom: z.string(),
    description: z.string(),
})

type ZoneFormSchema = z.infer<typeof zoneFormSchema>

type ZoneCreateFormProps = {
    refetch: () => void
}

export const ZoneCreateForm: React.FC<ZoneCreateFormProps> = (props) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const {
        register,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<ZoneFormSchema>({
        resolver: zodResolver(zoneFormSchema),
    })

    const onSubmit: SubmitHandler<ZoneFormSchema> = (newZone) => {
        fetchApiZonesCreate({ body: newZone })
            .then(() => {
                props.refetch()
                toast.success('Zone créée avec succès')
                onClose()
            })
            .catch(() => toast.error('Erreur lors de la création de la zone'))
    }

	return <>
        <Button onClick={onOpen}  
            size='sm'
            colorScheme='blue'
            variant='outline'
        >
            Ajouter une zone
        </Button>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Créer une zone
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody p='1em'>

                    <Flex as='form' onSubmit={handleSubmit(onSubmit)}
                        flexDirection='column'
                        gap='2em'
                    >

                        <FormControl isRequired>
                            <FormLabel>Nom zone</FormLabel>
                            <Input placeholder="" {...register('nom', { required: true })}></Input>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Input placeholder="Description de la zone" {...register('description')}></Input>
                        </FormControl>
                    
                        <Button
                            type='submit'
                            colorScheme='green'
                            isLoading={isSubmitting}
                        >
                            Créer
                        </Button>
                    </Flex>

                </ModalBody>
            </ModalContent>
        </Modal>

    </>
}