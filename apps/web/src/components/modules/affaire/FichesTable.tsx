import { Box, Button, HStack, Progress } from '@chakra-ui/react'
import { FicheDetail, fetchApiFichesCreate, fetchApiFichesDeleteCreate, fetchApiFichesPartialUpdate, useApiAffairesFichesRetrieve } from '@sgm/openapi'
import { Table, TableLayout, createColumnMeta } from '@sgm/ui'
import { useNavigate } from '@sgm/web/router'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { toast } from 'react-toastify'
import { AddFicheModele } from '../fiche/AddFicheModele'
import { AffaireNotesDrawer } from './AffaireNotesDrawer'

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

    const navigate = useNavigate()
    const fiches = useApiAffairesFichesRetrieve({ pathParams: { id: props.affaireId } })

	return <Box className='not-striped' w='100%'>

        <TableLayout
            header={{
                title: 'Fiches',
                customComponent: <HStack spacing='1em'>
                    <AddFicheModele affaireId={props.affaireId} refetch={fiches.refetch}/>
                    <AffaireNotesDrawer affaireId={props.affaireId}/>
                </HStack>
            }}
            chakraProps={{
                minHeight: 'unset'
            }}
        >

            <Table<FicheDetail>
                data={fiches.data?.fiches || []}
                columns={columns}
                loading={fiches.isLoading}
                editable={{
                    enabled: true,
                    onRowUpdate: async (row, newData) => {
                            fetchApiFichesPartialUpdate({ pathParams: { id: row.original.id }, body: newData })
                            .then(() => {
                                row.original = { ...row.original, ...newData }
                                toast.success('Fiche mise à jour')
                            })
                            .catch(() => toast.error('Erreur lors de la mise à jour de la fiche'))
                    }
                }}
                sortable
                newRow={() => {
                    fetchApiFichesCreate({
                        body: { affaire: props.affaireId }
                    }).then(() => fiches.refetch())
                }}
                rowSelection={{
                    enabled: true,
                    selectionActionComponent: ({ checkedItems, resetSelection }) => <Button 
                        size='sm'
                        colorScheme='red'
                        borderRadius='4px'
                        variant='outline'
                        onClick={async () => {
                            fetchApiFichesDeleteCreate({ body: { ids: checkedItems.map(item => item.original.id) } })
                            .then(() => {
                                resetSelection()
                                fiches.refetch()
                                toast.success('Etapes supprimées avec succès')
                            })
                            .catch(() => toast.error('Erreur lors de la suppression des étapes'))
                        }}
                    >Supprimer</Button>
                }}
                rowAction={{
                    enableCtrlClick: true,
                    actionFn: (row) => navigate('/affaires/:numAffaire/fiches/:id', {
                        params: {
                            numAffaire: `${row.original.num_affaire}`,
                            id: `${row.original.id}`
                        }
                    })
                }}
                loadingSkeletonRowsCount={3}
            />  

        </TableLayout>

    </Box>
}