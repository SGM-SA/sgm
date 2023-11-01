import { Box, Button, Textarea } from '@chakra-ui/react'
import { EtapeModeleDetail, GroupeMachine, fetchApiModelesEtapesCreate, fetchApiModelesEtapesDeleteCreate, fetchApiModelesEtapesPartialUpdate, useApiModelesFichesRetrieve } from '@sgm/openapi'
import { DefaultTableCell, Table, TableLayout, createColumnMeta } from '@sgm/ui'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { toast } from 'react-toastify'

const columnHelper = createColumnHelper<EtapeModeleDetail>()

type ModeleEtapesTableProps = {
    ficheModeleId: number
    groupesMachines: GroupeMachine[]
}

export const ModeleEtapesTable: React.FC<ModeleEtapesTableProps> = (props) => {

    const { data, isLoading, refetch } = useApiModelesFichesRetrieve({ pathParams: { id: props.ficheModeleId } })

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
                    {props.groupesMachines.find(groupeMachine => groupeMachine.id === cell.getValue())?.nom_groupe || ''}
                </DefaultTableCell>,
            meta: createColumnMeta({
                editable: true,
                type: 'select',
                choices: props.groupesMachines.map(groupeMachine => ({
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


	return <Box className='not-striped' w='100%'>

        <TableLayout
            header={{
                title: 'Etapes',
            }}
            chakraProps={{
                minHeight: 'unset'
            }}
        >

            <Table<EtapeModeleDetail>
                data={data?.etapes_modele || []}
                columns={columns}
                loading={isLoading}
                editable={{
                    enabled: true,
                    onRowUpdate: async (row, newData) => {
                        fetchApiModelesEtapesPartialUpdate({ pathParams: { id: row.original.id }, body: newData })
                            .then(() => {
                                refetch()
                                toast.success('Etape modèle mise à jour')
                            })
                            .catch(() => toast.error('Erreur lors de la mise à jour de l\'étape modèle'))
                    }
                }}
                sortable
                newRow={() => {
                    fetchApiModelesEtapesCreate({
                        body: {
                            fiche_modele: props.ficheModeleId,
                            num_etape: (data?.etapes_modele.length || 0) + 1
                        }
                    }).then(() => {
                        refetch()
                        toast.success('Etape modèle créée')
                    })
                }}
                rowSelection={{
                    enabled: true,
                    selectionActionComponent: ({ checkedItems, resetSelection }) => <Button
                        size='sm'
                        colorScheme='red'
                        borderRadius='4px'
                        variant='outline'
                        onClick={async () => {
                            fetchApiModelesEtapesDeleteCreate({ body: { ids: checkedItems.map(item => item.original.id) } })
                            .then(() => {
                                resetSelection()
                                refetch()
                                toast.success('Etapes supprimées avec succès')
                            })
                            .catch(() => toast.error('Erreur lors de la suppression des étapes'))
                        }}
                    >Supprimer</Button>
                }}
                rowExpansion={{
                    enabled: true,
                    expandedByDefault: true,
                    renderComponent: ({ row }) => {

                        const handleUpdate = (newDescription: string) => {
                            
                            if (row.original.description !== newDescription) {
                                fetchApiModelesEtapesPartialUpdate({ pathParams: { id: row.original.id }, body: { description: newDescription } })
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
                loadingSkeletonRowsCount={3}
            />

        </TableLayout>

    </Box>
}
