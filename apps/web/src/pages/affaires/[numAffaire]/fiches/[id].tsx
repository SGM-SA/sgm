import { Box, Button, HStack, Textarea } from '@chakra-ui/react'
import { EtapeDetail, EtapeDetailAjustage, fetchApiEtapesCreate, fetchApiEtapesDeleteCreate, fetchApiEtapesPartialUpdate, fetchApiGroupeMachineList, useApiFichesEtapesRetrieve } from '@sgm/openapi'
import { DefaultTableCell, Table, TableLayout, createColumnMeta } from '@sgm/ui'
import { useParams } from '@sgm/web/router'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { LoaderFunction, useLoaderData } from 'react-router-typesafe'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../../../components/layouts'

export const Loader = (() => {
    return fetchApiGroupeMachineList({})
}) satisfies LoaderFunction

export const Catch = (() => {
    return <div>Erreur</div>
})

const columnHelper = createColumnHelper<EtapeDetail>()

const FichePage: React.FC = () => {

    const params = useParams('/affaires/:numAffaire/fiches/:id'),
          ficheId = parseInt(params.id)

    const groupeMachines = useLoaderData<typeof Loader>()

    const { data, isLoading, refetch } = useApiFichesEtapesRetrieve({ pathParams: { id: ficheId }})

    const columns = [
        columnHelper.accessor('num_etape', {
            id: 'num_etape',
            header: 'Numéro',
            meta: createColumnMeta({
                sortable: true,
                disableWarnings: true
            })
        }),
        columnHelper.accessor('groupe_machine', {
            header: 'Groupe machine',
            cell: (cell) => 
                <DefaultTableCell {...cell}>
                    {groupeMachines.results?.find(groupeMachine => groupeMachine.id === cell.getValue())?.nom_groupe || ''}
                </DefaultTableCell>,
            meta: createColumnMeta({
                editable: true,
                type: 'select',
                choices: groupeMachines.results?.map(groupeMachine => ({
                    label: groupeMachine.nom_groupe,
                    value: groupeMachine.id
                })) || [],
                nullable: false,
                sortable: true,
                disableWarnings: true
            })
        }),
        columnHelper.accessor('rep', {
            header: 'REP',
            meta: createColumnMeta({
                editable: true,
                type: 'text',
                sortable: true,
            })
        }),
        columnHelper.accessor('plan', {
            header: 'Plan',
            meta: createColumnMeta({
                editable: true,
                type: 'text',
                sortable: true,
            })
        }),
        columnHelper.accessor('quantite', {
            header: 'Quantité',
            meta: createColumnMeta({
                editable: true,
                type: 'number',
                sortable: true,
            })
        }),
        columnHelper.accessor('temps', {
            header: 'Temps',
            meta: createColumnMeta({
                editable: true,
                type: 'number',
                sortable: true,
            })
        }),
        columnHelper.accessor('terminee', {
            header: 'Terminée',
            meta: createColumnMeta({
                editable: true,
                type: 'boolean',
                sortable: true,
            })
        }),
    ]

	return <>
        <DashboardLayout title={'Fiche'} >

            <TableLayout
                header={{
                    title: 'Liste des étapes',
                    customComponent: <HStack>
                        <Button
                            size='sm'
                            colorScheme='blue'
                            borderRadius='4px'
                            variant='outline'
                            onClick={() => {
                                // TODO: implement
                                window.print() // temporary
                            }}
                        >
                            Imprimer
                        </Button>
                    </HStack>
                }}
            >

                <Table<EtapeDetailAjustage>
                    columns={columns}
                    data={data?.etapes}
                    loading={isLoading}
                    editable={{
                        enabled: true,
                        onRowUpdate: async (row, newData) => {
                            fetchApiEtapesPartialUpdate({ pathParams: { id: row.original.id }, body: newData })
                                .then(() => {
                                    row.original = { ...row.original, ...newData }
                                    toast.success('Etape mise à jour')
                                })
                                .catch(() => toast.error('Erreur lors de la mise à jour de l\'étape'))
                        }
                    }}
                    newRow={() => {
                        if (!data) return

                        fetchApiEtapesCreate({
                            body: {
                                fiche: ficheId,
                                num_etape: data.etapes.length + 1 || 1
                            }
                        })
                            .then(() => {
                                refetch()
                                toast.success('Etape créée')
                            })
                            .catch(() => toast.error('Erreur lors de la création de l\'étape'))
                    }}
                    rowSelection={{
                        enabled: true,
                        selectionActionComponent: ({ checkedItems, resetSelection }) => <Box>
                            <Button 
                                size='sm'
                                colorScheme='red'
                                borderRadius='4px'
                                variant='outline'
                                onClick={async () => {
                                    fetchApiEtapesDeleteCreate({ body: { ids: checkedItems.map(item => item.original.id) } })
                                        .then(() => {
                                            resetSelection()
                                            refetch()
                                            toast.success('Etapes supprimées avec succès')
                                        })
                                        .catch(() => toast.error('Erreur lors de la suppression des étapes'))
                                }}
                            >Supprimer</Button>
                        </Box>
                    }}
                    rowExpansion={{
                        enabled: true,
                        expandedByDefault: true,
                        renderComponent: ({ row }) => {

                            const handleUpdate = (newDescription: string) => {
                                
                                if (row.original.description !== newDescription) {
                                    fetchApiEtapesPartialUpdate({ pathParams: { id: row.original.id }, body: { description: newDescription } })
                                        .then(() => toast.success('Description mise à jour'))
                                        .catch(() => toast.error('Erreur lors de la mise à jour de la description'))
                                }
                            }

                            return <Textarea 
                                defaultValue={row.original.description || ''}
                                onBlur={(e) => handleUpdate(e.target.value)}
                                rows={2}
                                fontSize='sm'
                            />
                        }
                    }}
                />

            </TableLayout>


        </DashboardLayout>
    </>
}

export default FichePage