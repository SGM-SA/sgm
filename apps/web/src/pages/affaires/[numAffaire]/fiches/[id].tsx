import { fetchApiGroupeMachineList } from '@sgm/openapi'
import { useParams } from '@sgm/web/router'
import React from 'react'
import { LoaderFunction, useLoaderData } from 'react-router-typesafe'
import { DashboardLayout } from '../../../../components/layouts'
import { EtapesTable, FicheStats } from '../../../../components/modules'

export const Loader = (() => {
    return fetchApiGroupeMachineList({})
}) satisfies LoaderFunction

export const Catch = (() => {
    return <div>Erreur</div>
})

const FichePage: React.FC = () => {

    const params = useParams('/affaires/:numAffaire/fiches/:id'),
          ficheId = parseInt(params.id)

    const groupesMachines = useLoaderData<typeof Loader>()

	return <>
        <DashboardLayout 
            title={'Fiche'}
            customHeader={<FicheStats ficheId={ficheId}/>}
        >

            <EtapesTable ficheId={ficheId} groupesMachines={groupesMachines?.results || []}/>
        </DashboardLayout>
    </>
}

export default FichePage