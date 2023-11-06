import { Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Icon, Spinner, useDisclosure } from '@chakra-ui/react'
import { useApiNotesAffaireList } from '@sgm/openapi'
import React, { useEffect, useState } from 'react'
import { HiOutlineMenu } from 'react-icons/hi'
import { AffaireNotes } from './AffaireNotes'

type AffaireNotesDrawerProps = {
    affaireId: number
}

export const AffaireNotesDrawer: React.FC<AffaireNotesDrawerProps> = (props) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [hasBeenOpened, setHasBeenOpened] = useState(false)

    const notes = useApiNotesAffaireList({  pathParams: { affaireId: props.affaireId } }, {
        enabled: hasBeenOpened,
        cacheTime: 10000
    })

    useEffect(() => {
        if (isOpen && !hasBeenOpened) setHasBeenOpened(true)
    }, [isOpen, hasBeenOpened])

	return <>
        <Button onClick={onOpen} variant='outline' colorScheme='black'  size='sm'>
            Notes <Icon as={HiOutlineMenu} ml='1em'/>
        </Button>

        
        <Drawer placement='right' onClose={onClose} isOpen={isOpen} size='md'>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerBody
                    paddingY='2em'
                    paddingX='2em'
                >
                    {notes.isLoading && <Spinner />}
                    {notes.isError && <p>Erreur lors du chargement des notes</p>}
                    {notes.data && <AffaireNotes notes={notes.data} affaireId={props.affaireId} refetch={notes.refetch}/>}
                </DrawerBody>
            </DrawerContent>
        </Drawer>   
    </>
}