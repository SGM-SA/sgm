import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerOverlay, IconButton, Image, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { BsFillCalendar2WeekFill, BsGearFill } from 'react-icons/bs'
import { RiComputerLine } from 'react-icons/ri'
import { HiOutlineMenu, HiTemplate } from 'react-icons/hi'
import { TfiMenuAlt } from 'react-icons/tfi'
import { FiLogOut } from 'react-icons/fi'

import { SideBarLink } from './SideBarLink'
import { SideBarSection } from './SideBarSection'

type SideBarProps = {}

export const SideBar: React.FC<SideBarProps> = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()

	return <>

        <IconButton
            onClick={onOpen}
            icon={<HiOutlineMenu />}
            aria-label='Menu'
            position='fixed'
            top='1rem'
            left='1rem'
            zIndex={1}
        />

        <Drawer placement='left' onClose={onClose} isOpen={isOpen} >

            <DrawerOverlay />
            <DrawerContent>
                <DrawerBody py='2rem'>

                    <SideBarSection>
                        <Image src='/logo.jpg' alt='Logo' />
                    </SideBarSection>

                    <SideBarSection title='Affaires'>
                        <SideBarLink icon={TfiMenuAlt} text='Liste' to='/affaires' />
                    </SideBarSection>

                    <SideBarSection title='Machines'>
                        <SideBarLink icon={BsGearFill} text='Gestion' to='/machines' />
                    </SideBarSection>

                    <SideBarSection title='Zones'>
                        <SideBarLink icon={BsGearFill} text='Gestion' to='/zones' />
                    </SideBarSection>

                    <SideBarSection title='Planning'>
                        <SideBarLink icon={RiComputerLine} text='Machines' to='/planning/machines' />
                        <SideBarLink icon={BsFillCalendar2WeekFill} text='Zones' to='/planning/zones' />
                    </SideBarSection>

                    <SideBarSection title='Modèles'>
                        <SideBarLink icon={HiTemplate} text='Fiches modèles' to='/modeles' />
                    </SideBarSection>

                    <SideBarSection separator={false}>
                        <SideBarLink icon={FiLogOut} text='Déconnexion' to='/auth/logout' color='red'/>
                    </SideBarSection>

                </DrawerBody>

                <DrawerFooter justifyContent='center'>
                    <Button as='a'
                        colorScheme='blue'
                        backgroundColor='primary.100'
                        w='100%'
                        href='mailto:contact@cloudflow.info'
                        target='_blank'
                    >
                        Contacter le support
                    </Button>
                </DrawerFooter>
            </DrawerContent>

        </Drawer>
    </>
}
