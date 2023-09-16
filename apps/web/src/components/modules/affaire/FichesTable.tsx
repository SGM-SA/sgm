import { Box, Button, Progress } from '@chakra-ui/react'
import { FicheDetail, fetchApiFichesCreate, fetchApiFichesDeleteCreate, useApiAffairesFichesRetrieve } from '@sgm/openapi'
import { Table, createMeta } from '@sgm/ui'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { AddFicheModele } from '../fiche/AddFicheModele'

const columnHelper = createColumnHelper<FicheDetail>()

const columns = [
    columnHelper.accessor('num_affaire', {
        id: 'numero',
        header: 'Numéro',
    }),
    columnHelper.accessor('description', {
        id: 'description',
        header: 'Description',
        meta: createMeta({
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
        meta: createMeta({
            editable: true,
            type: 'boolean'
        })
    }),
    columnHelper.accessor('terminee', {
        id: 'terminee',
        header: 'Terminée',
        meta: createMeta({
            editable: true,
            type: 'boolean'
        })
    }),
]

type FichesTableProps = {
    affaireId: number
}

export const FichesTable: React.FC<FichesTableProps> = (props) => {

    const { data, refetch, isLoading } = useApiAffairesFichesRetrieve({ pathParams: { id: props.affaireId } })

	return <Box className='not-striped'>
        <Table<FicheDetail>
            data={data?.fiches || []}
            columns={columns}
            loading={isLoading}
            header={{
                title: 'Fiches',
                customHeader: () => <AddFicheModele affaireId={props.affaireId} refetch={refetch}/>
            }}
            editable
            sorting
            newRow={() => {
                fetchApiFichesCreate({
                    body: { affaire: props.affaireId }
                }).then(() => refetch())
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
                                    refetch()
                                })
                            }}
                        >Supprimer</Button>
                    </Box>
                }
            }}
            styling={{
                container: {
                    minHeight: 'unset'
                },
                table: {
                    variant: 'unstyled'
                }
            }}
            loadingSkeletonRowsCount={3}
        />     
    </Box>
}