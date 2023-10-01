import { Box, Button, HStack } from '@chakra-ui/react'
import { ListZone, fetchApiMachinesPartialUpdate, fetchApiZonesDeleteCreate, useApiZonesList } from '@sgm/openapi'
import { Table, createColumnMeta, useTableQueryHelper } from '@sgm/ui'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../components/layouts'
import { ZoneCreateForm } from '../../components/modules'

const columnHelper = createColumnHelper<ListZone>()

const columns = [
    columnHelper.accessor('nom', {
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
]

const MachinesPage: React.FC = () => {

    const { pagination, setPagination, fetchDataOptions } = useTableQueryHelper()

    const { data, isLoading, refetch } = useApiZonesList(fetchDataOptions)

	return <>
        <DashboardLayout
            title='Zones'
            removePadding={true}
        >
            <Table<ListZone> 
                columns={columns}
                data={data}
                loading={isLoading}
                header={{
                    title: 'Gestion des zones',
                    customComponent: () => <HStack>
                        <ZoneCreateForm refetch={refetch}/>
                    </HStack>
                }}
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
                                toast.success('Zone mise à jour')
                            })
                            .catch(() => toast.error('Erreur lors de la mise à jour de la zone'))
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
                                // TODO: change implementation when backend is standardized
                                fetchApiZonesDeleteCreate({ body: { ids: checkedItems.map(item => item.original.id) } })
                                    .then(() => {
                                        resetSelection()
                                        refetch()
                                        toast.success('Zones supprimées avec succès')
                                    })
                                    .catch(() => toast.error('Erreur lors de la suppression des zones'))
                            }}
                        >Supprimer</Button>
                    </Box>
                }}
            />

        </DashboardLayout>
    </>
}

export default MachinesPage