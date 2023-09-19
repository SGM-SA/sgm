import { useParams } from '@sgm/web/router'
import { DashboardLayout } from '../../../../../components/layouts'
import React from 'react'
import { EtapeDetail, EtapeDetailAjustage, FicheDetail, useApiFichesEtapesRetrieve, useApiFichesRetrieve } from '@sgm/openapi'
import { createColumnHelper } from '@tanstack/react-table'
import { Table, createColumnMeta } from '@sgm/ui'
import { Textarea } from '@chakra-ui/react'

const columnHelper = createColumnHelper<EtapeDetail>()

const columns = [
    columnHelper.accessor('num_etape', {
        id: 'num_etape',
        header: 'Numéro',
        meta: createColumnMeta({
            sortable: true,
            disableWarnings: true
        })
    }),
    columnHelper.accessor('machine.nom_machine', {
        // TODO: vérifier que ça marche au niveau du sortable avec le nested accessor
        id: 'machine.nom_machine',
        header: 'Machine',
        meta: createColumnMeta({
            sortable: true,
            disableWarnings: true
        })
    }),
    columnHelper.accessor('rep', {
        id: 'rep',
        header: 'REP',
        meta: createColumnMeta({
            editable: true,
            type: 'text',
            sortable: true,
        })
    }),
    columnHelper.accessor('plan', {
        id: 'plan',
        header: 'REP',
        meta: createColumnMeta({
            editable: true,
            type: 'text',
            sortable: true,
        })
    }),
    columnHelper.accessor('quantite', {
        id: 'quantite',
        header: 'Quantité',
        meta: createColumnMeta({
            editable: true,
            type: 'number',
            sortable: true,
        })
    }),
    columnHelper.accessor('temps', {
        id: 'temps',
        header: 'Temps',
        meta: createColumnMeta({
            editable: true,
            type: 'number',
            sortable: true,
        })
    }),
    columnHelper.accessor('terminee', {
        id: 'terminee',
        header: 'Terminée',
        meta: createColumnMeta({
            editable: true,
            type: 'boolean',
            sortable: true,
        })
    }),
]

const FichePage: React.FC = () => {

    const params = useParams('/dashboard/affaires/:numAffaire/fiches/:id'),
          ficheId = parseInt(params.id)

    const { data, isLoading } = useApiFichesEtapesRetrieve({ pathParams: { id: ficheId }})

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