import { Box, Progress } from '@chakra-ui/react'
import { AffaireDetails, fetchApiAffairesPartialUpdate, useApiAffairesList } from '@sgm/openapi'
import { Table, TableLayout, createColumnMeta, useTableQueryHelper } from '@sgm/ui'
import { Link, useNavigate } from '@sgm/web/router'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../components/layouts'
import { AffaireNotesDrawer, AffaireSearch, FichesTable } from '../../components/modules'

const columnHelper = createColumnHelper<AffaireDetails>()

const columns = [
    columnHelper.accessor('num_affaire', {
        id: 'num_affaire',
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
        id: 'description',
        header: 'Description',
        meta: createColumnMeta({
            editable: true,
            type: 'text'
        })
    }),
    columnHelper.accessor('avancement_affaire', {
        id: 'avancement_affaire',
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
        id: 'client',
        header: 'Client',
        meta: createColumnMeta({
            editable: true,
            type: 'text'
        })
    }),
    columnHelper.accessor(row => row.charge_affaire_detail ? `${row.charge_affaire_detail.surname} ${row.charge_affaire_detail.name}` : null, {
        id: 'charge_affaire',
        header: 'Chargé d\'affaire',
    }),
    // TODO: accessor sur la date de création (c'est quelle key ??)
    columnHelper.accessor('date_rendu', { // TODO: date_rendu ou date_cloture ?
        id: 'date_rendu',
        header: 'Délais',
        meta: createColumnMeta({
            editable: true,
            type: 'date',
            sortable: true
        })
    }),
    columnHelper.accessor('statut', {
        id: 'statut',
        header: 'Statut',
        meta: createColumnMeta({
            editable: true,
            type: 'select',
            choices: [
                'S00',
                'A00',
                'EHA',
                'EAA',
                'EAC',
                'P00',
                'T00',
                'E00',
                'ECC',
                'INT',
                'ECA',
                'ED',
                'D00',
                'G00',
                'SV0',
                'EST',
                'ECH',
            ],
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
                    customComponent: <AffaireSearch filters={filters} setFilters={setFilters} />
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