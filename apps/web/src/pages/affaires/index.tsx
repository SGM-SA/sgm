import {Box, Progress} from '@chakra-ui/react'
import {
    AffaireDetails,
    affaireStatus,
    fetchApiAffairesPartialUpdate,
    fetchApiGroupeMachineList,
    useApiAffairesList
} from '@sgm/openapi'
import {DefaultTableCell, Table, TableLayout, TextLink, createColumnMeta, useTableQueryHelper} from '@sgm/ui'
import {Link, useNavigate} from '@sgm/web/router'
import {createColumnHelper} from '@tanstack/react-table'
import React from 'react'
import {LoaderFunction, useLoaderData} from 'react-router-typesafe'
import {toast} from 'react-toastify'
import {DashboardLayout} from '../../components/layouts'
import {AffaireNotesDrawer, AffairesStats, AffairesFilters, FichesTable} from '../../components/modules'

export const statusColors = {
    'green': ['E00'],
    'yellow': ['EAA', 'EAC'],
    'orange': ['ECC'],
    'purple': ['ECH'],
    'blue': ['ED'],
    'red': ['EHA', 'EST', 'ECA'],
}

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
                <TextLink>{value.getValue()}</TextLink>
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
    columnHelper.accessor(row => row.charge_affaire, {
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
    columnHelper.accessor('statut', {
        id: 'statut',
        header: 'Statut',
        cell: cell => cell.getValue() ? <Box
            as='span'
            px='.75em'
            py='.25em'
            borderRadius='15px'
            fontSize='.8em'
            color={`${Object.entries(statusColors).find(([_, value]) => value.includes(cell.getValue()!))?.[0] || 'gray'}.700`}
            bg={`${Object.entries(statusColors).find(([_, value]) => value.includes(cell.getValue()!))?.[0] || 'gray'}.100`}
        >
            {cell.getValue()}
        </Box> : <Box></Box>,
        meta: createColumnMeta({
            editable: true,
            type: 'select',
            choices: affaireStatus
        }),
    }),
    columnHelper.accessor('validation_ingenieur', {
        header: 'Vali. ingé.',
        meta: createColumnMeta({
            editable: true,
            type: 'boolean',
        }),
    }),
    columnHelper.display({
        id: 'notes',
        cell: value => {
            return <AffaireNotesDrawer affaireId={value.row.original.id}/>
        },
    })
]

export const Loader = (() => {
    return fetchApiGroupeMachineList({})
}) satisfies LoaderFunction

export const Catch = (() => {
    return <div>Erreur</div>
})

const AffairesPage: React.FC = () => {

    const groupesMachines = useLoaderData<typeof Loader>()

    const {
        pagination,
        setPagination,
        sorting,
        setSorting,
        filters,
        setFilters,
        fetchDataOptions
    } = useTableQueryHelper()
    const navigate = useNavigate()

    const {data, isLoading, refetch} = useApiAffairesList(fetchDataOptions)

    return <>
        <DashboardLayout
            title='Affaires'
            customHeader={<AffairesStats/>}
        >

            <TableLayout
                header={{
                    title: 'Liste des affaires',
                    customComponent: <AffairesFilters filters={filters} setFilters={setFilters}/>
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
                            fetchApiAffairesPartialUpdate({pathParams: {id: row.original.id}, body: newData})
                                .then(() => {
                                    refetch()
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
                        renderComponent: ({row}) => <FichesTable affaireId={row.original.id}
                                                                 groupesMachines={groupesMachines?.results || []}
                                                                 refetches={[refetch]}/>
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
                        table: {variant: 'simple'},
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
