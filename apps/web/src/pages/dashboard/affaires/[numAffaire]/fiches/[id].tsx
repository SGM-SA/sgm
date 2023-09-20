import { Textarea } from '@chakra-ui/react'
import { EtapeDetail, EtapeDetailAjustage, fetchApiEtapesPartialUpdate, fetchApiGroupeMachineList, fetchApiGroupeMachineRetrieve, fetchApiMachinesRetrieve, useApiFichesEtapesRetrieve } from '@sgm/openapi'
import { ChoiceFn, DefaultTableCell, Table, createColumnMeta } from '@sgm/ui'
import { useParams } from '@sgm/web/router'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../../../../components/layouts'
import { LoaderFunction, useLoaderData } from 'react-router-typesafe'

export const Loader = (() => {
    return fetchApiGroupeMachineList({})
}) satisfies LoaderFunction

export const Catch = (() => {
    return <div>Erreur</div>
})

const columnHelper = createColumnHelper<EtapeDetail>()

const FichePage: React.FC = () => {

    const params = useParams('/dashboard/affaires/:numAffaire/fiches/:id'),
          ficheId = parseInt(params.id)

    const groupeMachines = useLoaderData<typeof Loader>()

    const { data, isLoading } = useApiFichesEtapesRetrieve({ pathParams: { id: ficheId }})

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
            cell: (cell) => <DefaultTableCell {...cell}>
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
            header: 'REP',
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
        <DashboardLayout
            title={'Fiche'}
        >

            <Table<EtapeDetailAjustage>
                columns={columns}
                data={data?.etapes}
                loading={isLoading}
                header={{
                    title: 'Liste des étapes',
                }}
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
                rowExpansion={{
                    enabled: true,
                    renderComponent: () => {
                        return <Textarea>
                            {data?.etapes[0].description}
                        </Textarea>
                    }
                }}
            />

        </DashboardLayout>
    </>
}

export default FichePage