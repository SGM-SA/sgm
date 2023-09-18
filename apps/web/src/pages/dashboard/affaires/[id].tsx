import { Box } from '@chakra-ui/react'
import { useApiAffairesRetrieve } from '@sgm/openapi'
import { useParams } from '@sgm/web/router'
import React from 'react'
import { DashboardLayout } from '../../../components/layouts'
import { FichesTable } from '../../../components/modules'

const AffairePage: React.FC = () => {

    const { id } = useParams('/dashboard/affaires/:id')
    const affaireId = parseInt(id)

    const affaire = useApiAffairesRetrieve({ pathParams: { id: affaireId } })

	return <>
        <DashboardLayout
            title={`Détails affaire n°${affaire.data?.num_affaire || ''}`}
            removePadding={true}
        >
            <Box padding='1em' w='100%'>
                <FichesTable affaireId={affaireId} />
            </Box>
        </DashboardLayout>
    </>
}

export default AffairePage