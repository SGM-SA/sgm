import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, HStack, Icon, Progress, Spinner, useDisclosure } from '@chakra-ui/react'
import { FicheDetail, fetchApiFichesCreate, fetchApiFichesDeleteCreate, useApiAffairesFichesRetrieve, useApiNotesAffaireList } from '@sgm/openapi'
import { Table, createColumnMeta } from '@sgm/ui'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { AddFicheModele } from '../fiche/AddFicheModele'
import { HiOutlineMenu } from 'react-icons/hi'
import { AffaireNotes } from './AffaireNotes'
import { useNavigate } from '@sgm/web/router'

const columnHelper = createColumnHelper<FicheDetail>()

const columns = [
    columnHelper.accessor('num_affaire', {
        id: 'numero',
        header: 'Numéro',
        meta: createColumnMeta({
            disableWarnings: true
        })
    }),
    columnHelper.accessor('description', {
        id: 'description',
        header: 'Description',
        meta: createColumnMeta({
            editable: true,
            type: 'text'
        })
    }),
    columnHelper.accessor('avancement_fiche', {
        id: 'avancement',
        header: 'Avancement',
        cell: value => <Box>
            <Box as='span' fontSize='xs'>{value.getValue()}%</Box>
            <Progress value={value.getValue()} 
                background='#c7d2fe'
                borderRadius='10px'
                size='sm'
                mt='.5em'
            />
        </Box>,
    }),
    columnHelper.accessor('fourniture', {
        id: 'fourniture',
        header: 'Fournitures',
        meta: createColumnMeta({
            editable: true,
            type: 'boolean'
        })
    }),
    columnHelper.accessor('terminee', {
        id: 'terminee',
        header: 'Terminée',
        meta: createColumnMeta({
            editable: true,
            type: 'boolean'
        })
    }),
]

type FichesTableProps = {
    affaireId: number
}

export const FichesTable: React.FC<FichesTableProps> = (props) => {

    const notesDrawer = useDisclosure()
    const navigate = useNavigate()
    const fiches = useApiAffairesFichesRetrieve({ pathParams: { id: props.affaireId } })
    const notes = useApiNotesAffaireList({  pathParams: { affaireId: props.affaireId } })

	return <Box className='not-striped' w='100%'>

        <Table<FicheDetail>
            data={fiches.data?.fiches || []}
            columns={columns}
            loading={fiches.isLoading}
            header={{
                title: 'Fiches',
                customComponent: () => <HStack>
                    <AddFicheModele affaireId={props.affaireId} refetch={fiches.refetch}/>
                    <Button onClick={notesDrawer.onOpen} variant='outline' colorScheme='black'  size='sm'>
                        Notes <Icon as={HiOutlineMenu} ml='1em'/>
                    </Button>
                </HStack>

            }}
            editable
            sortable
            newRow={() => {
                fetchApiFichesCreate({
                    body: { affaire: props.affaireId }
                }).then(() => fiches.refetch())
            }}
            rowSelection={{
                enabled: true,
                selectionActionComponent: ({ checkedItems, resetSelection }) => {
                    return <Box>
                        <Button 
                            size='sm'
                            colorScheme='red'
                            borderRadius='4px'
                            variant='outline'
                            onClick={async () => {
                                fetchApiFichesDeleteCreate({
                                    body: {
                                        ids: checkedItems.map(item => item.original.id)
                                    }
                                }).then(() => {
                                    resetSelection()
                                    fiches.refetch()
                                })
                            }}
                        >Supprimer</Button>
                    </Box>
                }
            }}
            rowAction={{
                enableCtrlClick: true,
                actionFn: (row) => navigate('/dashboard/affaires/:numAffaire/fiches/:id', {
                    params: {
                        numAffaire: `${row.original.num_affaire}`,
                        id: `${row.original.id}`
                    }
                })
            }}
            styling={{
                container: {
                    minHeight: 'unset'
                },
            }}
            loadingSkeletonRowsCount={3}
        />  

        <Drawer placement='right' onClose={notesDrawer.onClose} isOpen={notesDrawer.isOpen}>
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

    </Box>
}