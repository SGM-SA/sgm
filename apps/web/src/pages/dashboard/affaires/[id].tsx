import { useParams } from '@sgm/web/router'
import React from 'react'
import { DashboardLayout } from '../../../components/layouts'
import { FichesTable } from '../../../components/modules'
import { Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Icon, useDisclosure } from '@chakra-ui/react'
import { HiOutlineMenu } from 'react-icons/hi'

const AffairePage: React.FC = () => {

    const { id } = useParams('/dashboard/affaires/:id')
    const { isOpen, onOpen, onClose } = useDisclosure()

	return <>
        <DashboardLayout
            title={`Détails affaire n°${id}`}
            removePadding={true}
            customHeader={
                <Button
                    variant='outline'
                    color='white'
                    onClick={onOpen}
                >
                    Notes <Icon as={HiOutlineMenu} ml='1em'/>
                </Button>
            }
        >
            <FichesTable affaireId={parseInt(id)} />

            <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerBody>

                        
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </DashboardLayout>
    </>
}

export default AffairePage