import { Box, Progress } from '@chakra-ui/react'
import { AffaireDetails, affaireStatus, fetchApiAffairesPartialUpdate, useApiAffairesList } from '@sgm/openapi'
import { DefaultTableCell, Table, TableLayout, createColumnMeta, useTableQueryHelper } from '@sgm/ui'
import { Link, useNavigate } from '@sgm/web/router'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../components/layouts'
import { AffaireNotesDrawer, AffairesFilters, FichesTable } from '../../components/modules'

const columnHelper = createColumnHelper<AffaireDetails>()

const columns = [
    columnHelper.accessor('num_affaire', {
        cell: value => 
            <Link 
                to='/affaires/:numAffaire' 
                params={{
                    numAffaire: `${value.row.original.num_affaire}`
                }}
            >
                {value.getValue()}
            </Link>,
        header: 'Numéro',
        meta: createColumnMeta({
            sortable: true,
            disableWarnings: true
        })
    }),
    columnHelper.accessor('description', {
        header: 'Description',
        cell: cell => <DefaultTableCell {...cell}>
            <Box maxW='20em' overflowX='auto' overflowY='hidden'>
                {cell.getValue()}  
            </Box>
        </DefaultTableCell>,
        meta: createColumnMeta({
            cellHoverText: true,
            disableWarnings: true
        })
    }),
    columnHelper.accessor('avancement_affaire', {
        header: 'Avancement',
        cell: value => <Box>
            <Box as='span' fontSize='xs'>{value.getValue()}%</Box>
            <Progress value={value.getValue()} 
                background='#c7d2fe'
                borderRadius='10px'
                size='sm'
                mt='.5em'
            />
        </Box>
    }),
    columnHelper.accessor('client', {
        header: 'Client',
    }),
    columnHelper.accessor(row => row.charge_affaire_detail ? `${row.charge_affaire_detail.surname} ${row.charge_affaire_detail.name}` : null, {
        id: 'charge_affaire',
        header: 'Chargé d\'affaire',
    }),
    columnHelper.accessor('date_rendu', {
        id: 'date_rendu',
        header: 'Délais',
        meta: createColumnMeta({
            sortable: true
        })
    }),
    columnHelper.accessor('cout_affaire', {
        id: 'cout_affaire',
        header: 'Coût',
        meta: createColumnMeta({
            sortable: true
        })
    }),
    columnHelper.accessor('statut', {
        id: 'statut',
        header: 'Statut',
        meta: createColumnMeta({
            editable: true,
            type: 'select',
            choices: affaireStatus
        }),
    }),
    columnHelper.accessor('validation_ingenieur', {
        header: 'Validation ingénieur',
        meta: createColumnMeta({
            editable: true,
            type: 'boolean',
        }),
    }),
    columnHelper.display({
        id: 'notes',
        cell: value => {
            console.log(value.row.original.id)
            return <AffaireNotesDrawer affaireId={value.row.original.id}/>
        }
    })
]

const AffairesPage: React.FC = () => {

    const { pagination, setPagination, sorting, setSorting, filters, setFilters, fetchDataOptions } = useTableQueryHelper()
    const navigate = useNavigate()

    const { data, isLoading } = useApiAffairesList(fetchDataOptions)

	return <>
    	<DashboardLayout title="Affaires">
            
            <TableLayout
                header={{
                    title: 'Liste des affaires',
                    customComponent: <AffairesFilters filters={filters} setFilters={setFilters} />
                }}
            >

                <Table<AffaireDetails>
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
                            fetchApiAffairesPartialUpdate({ pathParams: { id: row.original.id }, body: newData })
                                .then(() => {
                                    row.original = { ...row.original, ...newData }
                                    toast.success('Affaire mise à jour')
                                })
                                .catch(() => toast.error('Erreur lors de la mise à jour de l\'affaire'))
                        }
                    }}
                    sortable={{
                        state: sorting,
                        setState: setSorting
                    }}
                    rowExpansion={{
                        enabled: true,
                        renderComponent: ({ row }) => <FichesTable affaireId={row.original.id} />
                    }}
                    rowAction={{
                        enableCtrlClick: true,
                        actionFn: (row) => navigate(`/affaires/:numAffaire`, {
                            params: {
                                numAffaire: `${row.original.num_affaire}`
                            }
                        })
                    }}
                    styling={{
                        table: { variant: 'simple' },
                        row: (row) => {
                            if (row.original.en_retard) return {
                                background: row.original.couleur_affichage
                            }
                        }
                    }}
                />
            </TableLayout>
        </DashboardLayout>
    </>
}

export default AffairesPage