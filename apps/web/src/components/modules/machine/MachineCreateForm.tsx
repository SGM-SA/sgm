import { Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchApiMachinesCreate } from '@sgm/openapi'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const machineFormSchema = z.object({
    nom_machine: z.string(),
    description: z.string(),
    fonctionnelle: z.boolean()
})

type MachineFormSchema = z.infer<typeof machineFormSchema>

type MachineCreateFormProps = {
    refetch: () => void
}

export const MachineCreateForm: React.FC<MachineCreateFormProps> = (props) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const {
        register,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<MachineFormSchema>({
        resolver: zodResolver(machineFormSchema),
        defaultValues: {
            fonctionnelle: true
        }
    })

    const onSubmit: SubmitHandler<MachineFormSchema> = (newMachine) => {
        fetchApiMachinesCreate({ body: newMachine })
            .then(() => {
                props.refetch()
                toast.success('Machine créée avec succès')
                onClose()
            })
            .catch(() => toast.error('Erreur lors de la création de la machine'))
    }

	return <>
        <Button onClick={onOpen}  
            size='sm'
            colorScheme='blue'
            variant='outline'
        >
            Ajouter une machine
        </Button>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Créer une machine
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody p='1em'>

                    <Flex as='form' onSubmit={handleSubmit(onSubmit)}
                        flexDirection='column'
                        gap='2em'
                    >

                        <FormControl isRequired>
                            <FormLabel>Nom machine</FormLabel>
                            <Input placeholder="Tour" {...register('nom_machine', { required: true })}></Input>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Input placeholder="Description de la machine" {...register('description')}></Input>
                        </FormControl>

                        <Flex as={FormControl}>
                            <FormLabel mb='unset'>Fonctionnelle</FormLabel>
                            <input {...register('fonctionnelle', { required: true, })}
                                type="checkbox" 
                            />
                        </Flex>
                    
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