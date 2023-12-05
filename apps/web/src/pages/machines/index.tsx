import { Box, Button } from '@chakra-ui/react'
import { GroupeMachine, fetchApiGroupeMachineDeleteCreate, fetchApiGroupeMachinePartialUpdate, useApiGroupeMachineList } from '@sgm/openapi'
import { Table, TableLayout, createColumnMeta, useTableQueryHelper } from '@sgm/ui'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../components/layouts'
import { MachinesTable } from '../../components/modules'

const columnHelper = createColumnHelper<GroupeMachine>()

const columns = [
    columnHelper.accessor('nom_groupe', {
        header: 'Nom',
        meta: createColumnMeta({
            editable: true,
            type: 'text'
        })
    }),
    columnHelper.accessor('prix_theorique', {
        header: 'Prix théorique',
        meta: createColumnMeta({
            editable: true,
            type: 'number'
        })
    }),
]

const MachinesPage: React.FC = () => {

    const { pagination, setPagination, fetchDataOptions } = useTableQueryHelper()

    const { data, isLoading, refetch } = useApiGroupeMachineList(fetchDataOptions)

	return <>
        <DashboardLayout title='Machines' >

            <TableLayout
                header={{
                    title: 'Groupes machines',
                }}
            >

                <Table<GroupeMachine> 
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
                            fetchApiGroupeMachinePartialUpdate({ pathParams: { id: row.original.id }, body: newData })
                                .then(() => {
                                    refetch()
                                    toast.success('Groupe machine mise à jour')
                                })
                                .catch(() => toast.error('Erreur lors de la mise à jour du groupe machine'))
                        }
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
                                    fetchApiGroupeMachineDeleteCreate({ body: { ids: checkedItems.map(item => item.original.id) } })
                                        .then(() => {
                                            resetSelection()
                                            refetch()
                                            toast.success('Machines supprimées avec succès')
                                        })
                                        .catch(() => toast.error('Erreur lors de la suppression des machines'))
                                }}
                            >Supprimer</Button>
                        </Box>
                    }}
                    rowExpansion={{
                        enabled: true,
                        renderComponent: ({ row }) => <MachinesTable groupeMachinesId={row.original.id}/>
                    }}
                />
            </TableLayout>


        </DashboardLayout>
    </>
}

export default MachinesPage