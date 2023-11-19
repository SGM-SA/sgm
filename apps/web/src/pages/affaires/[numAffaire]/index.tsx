import { Box } from '@chakra-ui/react'
import {
	fetchApiAffairesNumsRetrieve,
	fetchApiGroupeMachineList,
} from '@sgm/openapi'
import { Navigate } from '@sgm/web/router'
import React from 'react'
import { LoaderFunction, useLoaderData } from 'react-router-typesafe'
import { DashboardLayout } from '../../../components/layouts'
import { AffaireStats, FichesTable } from '../../../components/modules'

export const Loader = (async ({ params }) => {
	if (!params.numAffaire) throw new Error('numAffaire is required')

	return {
		groupesMachines: await fetchApiGroupeMachineList({}),
		affaire: await fetchApiAffairesNumsRetrieve({
			pathParams: { numAffaire: parseInt(params.numAffaire) },
		}),
	}
}) satisfies LoaderFunction

export const Catch = () => <Navigate to='/affaires' />

const AffairePage: React.FC = () => {
	const { groupesMachines, affaire } = useLoaderData<typeof Loader>()

	return (
		<>
			<DashboardLayout
				title={`Détails affaire n°${affaire.num_affaire}`}
				customHeader={affaire.num_affaire ? <AffaireStats numAffaire={affaire.num_affaire}/> : undefined}
			>
				<Box
					minH='70vh'
					w='100%'
				>
					<Box w='100%'>
						<FichesTable
							affaireId={affaire.id}
							groupesMachines={groupesMachines?.results || []}
						/>
					</Box>
				</Box>
			</DashboardLayout>
		</>
	)
}

export default AffairePage
