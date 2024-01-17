import { Box, Button } from '@chakra-ui/react'
import { EtapeDetail, EtapeDetailAjustage, GroupeMachine, fetchApiEtapesCreate, fetchApiEtapesDeleteCreate, fetchApiEtapesPartialUpdate, useApiFichesEtapesRetrieve } from '@sgm/openapi'
import { DefaultTableCell, Table, TableLayout, createColumnMeta } from '@sgm/ui'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { toast } from 'react-toastify'
import { EtapeDescriptionEditor } from './EtapeDescriptionEditor'

type EtapesTableProps = {
    ficheId: number
    groupesMachines: GroupeMachine[]
    refetches?: Array<() => void>
}

const columnHelper = createColumnHelper<EtapeDetail>()

export const EtapesTable: React.FC<EtapesTableProps> = (props) => {

    const { data, isLoading, refetch } = useApiFichesEtapesRetrieve({ pathParams: { id: props.ficheId }})

    const refetchAll = () => {
        refetch()
        props.refetches?.forEach(refetch => refetch())
    }

    const columns = [
        columnHelper.accessor('num_etape', {
            header: 'Numéro',
            meta: createColumnMeta({
                editable: true,
                type: 'number',
                sortable: true,
                disableWarnings: true
            })
        }),
        columnHelper.accessor('groupe_machine', {
            header: 'Groupe machine',
            cell: (cell) =>
                <DefaultTableCell {...cell}>
                    {props.groupesMachines?.find(groupeMachine => groupeMachine.id === cell.getValue())?.nom_groupe || ''}
                </DefaultTableCell>,
            meta: createColumnMeta({
                editable: true,
                type: 'select',
                choices: props.groupesMachines.map(groupeMachine => ({
                    label: groupeMachine.nom_groupe,
                    value: groupeMachine.id
                })) || [],
                nullable: true,
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
                type: 'file',
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
        columnHelper.accessor('cout_etape', {
            header: 'Coût',
            meta: createColumnMeta({
                sortable: true,
            })
        })
    ]

	return <>
        <TableLayout
            header={{
                title: 'Liste des étapes'
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
                                refetchAll()
                                toast.success('Etape mise à jour')
                            })
                            .catch(() => toast.error('Erreur lors de la mise à jour de l\'étape'))
                    }
                }}
                newRow={() => {
                    if (!data) return

                    fetchApiEtapesCreate({
                        body: {
                            fiche: props.ficheId,
                            num_etape: data.etapes.length + 1 || 1
                        }
                    })
                        .then(() => {
                            refetchAll()
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
                                        refetchAll()
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
                    renderComponent: ({ row }) => <EtapeDescriptionEditor row={row} />
                }}
            />

        </TableLayout>
    </>
}