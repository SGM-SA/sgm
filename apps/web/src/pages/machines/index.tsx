import { Box, Button, HStack } from '@chakra-ui/react'
import { MachineDetail, fetchApiMachinesDeleteCreate, fetchApiMachinesPartialUpdate, useApiMachinesList } from '@sgm/openapi'
import { Table, TableLayout, createColumnMeta, useTableQueryHelper } from '@sgm/ui'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../components/layouts'
import { MachineCreateForm } from '../../components/modules'

const columnHelper = createColumnHelper<MachineDetail>()

const columns = [
    columnHelper.accessor('nom_machine', {
        header: 'Nom',
        meta: createColumnMeta({
            editable: true,
            type: 'text'
        })
    }),
    columnHelper.accessor('description', {
        header: 'Description',
        meta: createColumnMeta({
            editable: true,
            type: 'text'
        })
    }),
    columnHelper.accessor('fonctionnelle', {
        header: 'Fonctionnelle',
        meta: createColumnMeta({
            editable: true,
            type: 'boolean'
        })
    }),
]

const MachinesPage: React.FC = () => {

    const { pagination, setPagination, fetchDataOptions } = useTableQueryHelper()

    const { data, isLoading, refetch } = useApiMachinesList(fetchDataOptions)

	return <>
        <DashboardLayout title='Machines' >

            <TableLayout
                header={{
                    title: 'Gestion des machines',
                    customComponent: <HStack>
                        <MachineCreateForm refetch={refetch}/>
                    </HStack>
                }}
            >

                <Table<MachineDetail> 
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
                            fetchApiMachinesPartialUpdate({ pathParams: { id: row.original.id }, body: newData })
                                .then(() => {
                                    row.original = { ...row.original, ...newData }
                                    if (newData.fonctionnelle !== undefined) refetch()
                                    toast.success('Machine mise à jour')
                                })
                                .catch(() => toast.error('Erreur lors de la mise à jour de la machine'))
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
                                    fetchApiMachinesDeleteCreate({ body: { ids: checkedItems.map(item => item.original.id) } })
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
                    styling={{
                        row: (row) => {
                            if (row.original?.fonctionnelle === false) {
                                return {
                                    backgroundColor: 'red.100'
                                }
                            }
                        }
                    }}
                />
            </TableLayout>


        </DashboardLayout>
    </>
}

export default MachinesPage