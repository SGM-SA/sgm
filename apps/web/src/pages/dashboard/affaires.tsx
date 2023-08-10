import { AffaireDetails, useApiAffairesList } from '@sgm/openapi'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { DashboardLayout } from '../../components/layouts'
import { Table } from '@sgm/ui'

const columnHelper = createColumnHelper<AffaireDetails>()

const columns = [
    columnHelper.accessor('num_affaire', {
        id: 'numero',
        header: 'Numéro',
        cell: value => value.getValue(),
    }),
    columnHelper.accessor('description', {
        id: 'description',
        header: 'Description',
        cell: value => value.getValue(),
    }),
    columnHelper.accessor('avancement_affaire', {
        id: 'avancement',
        header: 'Avancement',
        cell: value => value.getValue(),
    }),
    columnHelper.accessor('client', {
        id: 'client',
        header: 'Client',
        cell: value => value.getValue(),
    }),
    columnHelper.accessor(row => `${row.charge_affaire_detail.prenom} ${row.charge_affaire_detail.nom}`, {
        id: 'charge_affaire',
        header: 'Chargé d\'affaire',
    }),
    // TODO: accessor sur la date de création (c'est quelle key ??)
    columnHelper.accessor('date_rendu', { // TODO: date_rendu ou date_cloture ?
        id: 'delais',
        header: 'Délais',
        cell: value => value.getValue(),
    }),
    columnHelper.accessor('statut', {
        id: 'statut',
        header: 'Statut',
        cell: value => value.getValue(),
    }),
]

const AffairesPage: React.FC = () => {

    const { data } = useApiAffairesList({ queryParams: { page: '1', per_page: '10' } })

	return <>
    	<DashboardLayout 
			title="Liste affaires"
		>
            <Table<AffaireDetails>
                data={data?.results}
                columns={columns}
            />
        </DashboardLayout>
    </>
}

export default AffairesPage