import { Button } from '@chakra-ui/react'
import { FicheModeleDetail, fetchApiGroupeMachineList, fetchApiModelesFichesCreate, fetchApiModelesFichesDeleteCreate, fetchApiModelesFichesPartialUpdate, useApiModelesFichesList } from '@sgm/openapi'
import { Table, TableLayout, createColumnMeta, useTableQueryHelper } from '@sgm/ui'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { LoaderFunction, useLoaderData } from 'react-router-typesafe'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../components/layouts'
import { CopyFicheModele, ModeleEtapesTable } from '../../components/modules'

export const Loader = (() => {
    return fetchApiGroupeMachineList({})
}) satisfies LoaderFunction

export const Catch = (() => {
    return <div>Erreur</div>
})

const columnHelper = createColumnHelper<FicheModeleDetail>()

const columns = [
    columnHelper.accessor('titre', {
        header: 'Titre',
        meta: createColumnMeta({
            editable: true,
            type: 'text',
            sortable: true
        }),
    }),
    columnHelper.accessor('description', {
        header: 'Description',
        meta: createColumnMeta({
            editable: true,
            type: 'text',
            sortable: true
        }),
    }),
    columnHelper.accessor('fourniture', {
        header: 'Fournitures arrivées',
        meta: createColumnMeta({
            editable: true,
            type: 'boolean',
        }),
    }),
    columnHelper.display({
        id: 'copy',
        header: 'Copier',
        cell: value => <CopyFicheModele modeleId={value.row.original.id}/>
    })
]

const ModelesPagePage: React.FC = () => {

    const { pagination, setPagination, fetchDataOptions } = useTableQueryHelper()
    const { data, isLoading, refetch } = useApiModelesFichesList(fetchDataOptions)

    const groupeMachines = useLoaderData<typeof Loader>()

	return <>
        <DashboardLayout title='Fiches modèles'>

            <TableLayout
                header={{
                    title: 'Fiches modèles',
                }}
            >

                <Table<FicheModeleDetail>
                    columns={columns}
                    data={data}
                    loading={isLoading}
                    pagination={{ 
                        state: pagination, 
                        setState: setPagination 
                    }}
                    editable={{
                        enabled: true,
                        onRowUpdate: async (row, newData) => {
                            fetchApiModelesFichesPartialUpdate({ pathParams: { id: row.original.id }, body: newData })
                                .then(() => {
                                    refetch()
                                    toast.success('Fiche modèle mise à jour')
                                })
                                .catch(() => toast.error('Erreur lors de la mise à jour de la fiche modèle'))
                        }
                    }}
                    newRow={() => {
                        fetchApiModelesFichesCreate({})
                            .then(() => {
                                refetch()
                                toast.success('Fiche modèle créée')
                            })
                    }}
                    rowSelection={{
                        enabled: true,
                        selectionActionComponent: ({ checkedItems, resetSelection }) => 
                            <Button 
                                size='sm'
                                colorScheme='red'
                                borderRadius='4px'
                                variant='outline'
                                onClick={async () => {
                                    fetchApiModelesFichesDeleteCreate({ body: { ids: checkedItems.map(row => row.original.id) } })
                                    .then(() => {
                                        resetSelection()
                                        refetch()
                                        toast.success('Etapes supprimées avec succès')
                                    })
                                    .catch(() => toast.error('Erreur lors de la suppression des étapes'))
                                }}
                            >
                                Supprimer
                            </Button>
                    }}
                    rowExpansion={{
                        enabled: true,
                        renderComponent: ({ row }) => <ModeleEtapesTable ficheModeleId={row.original.id} groupesMachines={groupeMachines.results || []}/>
                    }}
                />


            </TableLayout>
        </DashboardLayout>
    </>
}

export default ModelesPagePage