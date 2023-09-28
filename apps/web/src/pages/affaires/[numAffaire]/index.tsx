import { Box } from '@chakra-ui/react'
import { fetchApiAffairesNumsRetrieve } from '@sgm/openapi'
import { Navigate } from '@sgm/web/router'
import React from 'react'
import { LoaderFunction, useLoaderData } from 'react-router-typesafe'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../../components/layouts'
import { FichesTable } from '../../../components/modules'

export const Loader = (async ({ params }) => {
    if (!params.numAffaire) throw new Error('numAffaire is required')
    
    return fetchApiAffairesNumsRetrieve({ pathParams: { numAffaire: parseInt(params.numAffaire) } })
        .then(affaire => affaire)
        .catch(() => {
            toast.error('Affaire non trouvée')
            throw new Error('Affaire not found')
        })
}) satisfies LoaderFunction

export const Catch = () => <Navigate to='/affaires' />

const AffairePage: React.FC = () => {

    const affaire = useLoaderData<typeof Loader>()

	return <>
        <DashboardLayout
            title={`Détails affaire n°${affaire.num_affaire}`}
            removePadding={true}
        >
            <Box minH='70vh' w='100%'>
                <Box w='100%'>
                    <FichesTable affaireId={affaire.id} />
                </Box>
            </Box>
        </DashboardLayout>
    </>
}

export default AffairePage