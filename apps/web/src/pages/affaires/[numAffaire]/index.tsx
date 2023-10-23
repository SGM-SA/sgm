import { Box } from '@chakra-ui/react'
import {
	fetchApiAffairesNumsRetrieve,
	fetchApiGroupeMachineList,
} from '@sgm/openapi'
import { Navigate } from '@sgm/web/router'
import React from 'react'
import { LoaderFunction, useLoaderData } from 'react-router-typesafe'
import { DashboardLayout } from '../../../components/layouts'
import { FichesTable } from '../../../components/modules'

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

	console.log('groupesMachines', groupesMachines)
	console.log('affaire', affaire)

	return (
		<>
			<DashboardLayout title={`Détails affaire n°${affaire.num_affaire}`}>
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
