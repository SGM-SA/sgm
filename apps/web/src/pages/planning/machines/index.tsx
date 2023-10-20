import { Box, Flex, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import { fetchApiAffectationsAjustagesDestroy, fetchApiAffectationsMachinesCreate, fetchApiAffectationsMachinesDestroy, fetchApiAffectationsMachinesPartialUpdate, fetchApiSalariesFormOptionsList, useApiFichesMachineAPlanifierList, useApiPlanningMachineList } from '@sgm/openapi'
import { BaseBoardCardType, Board, BoardColumnType, CUSTOM_FIRST_COLUMN_ID, TextLink } from '@sgm/ui'
import { Link } from '@sgm/web/router'
import { Select } from 'chakra-react-select'
import React, { useEffect, useState } from 'react'
import { LoaderFunction } from 'react-router-dom'
import { useLoaderData } from 'react-router-typesafe'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../../components/layouts'
import { PlanningNestedEtapeColumn } from '../../../components/modules'

export const Loader = (() => {
    return fetchApiSalariesFormOptionsList({})
}) satisfies LoaderFunction

export type PlanningMachineCard = BaseBoardCardType & {
    affectationId: number
    numEtape: number
    numAffaire?: number | null
    ficheId: number
    ficheName?: string
    responsible?: number
} 

const mockedSemaineAffectation = '2023-10-21'

const PlanningMachinesPage: React.FC = () => {

    const employees = useLoaderData<typeof Loader>()

    const machines = useApiPlanningMachineList({ queryParams: { date: mockedSemaineAffectation } })
    const itemsToPlan = useApiFichesMachineAPlanifierList({})
    const [canProcess, setCanProcess] = useState(true)

    const [columns, setColumns] = useState<BoardColumnType<PlanningMachineCard>[] | undefined>(undefined)

    useEffect(() => {
        
        if (machines.data && itemsToPlan.data && canProcess) {

            const itemsToPlanColumn: BoardColumnType<PlanningMachineCard> = {
                id: CUSTOM_FIRST_COLUMN_ID,
                title: 'A planifier',
                cards: itemsToPlan.data.flatMap(affaire => affaire.fiches.flatMap(fiche => fiche.etapes.map(etape => ({
                    id: etape.id,
                    title: `Etape n°${etape.num_etape}${etape.temps ? ` - ${etape.temps}(h)` : ''}${etape.groupe_machine ? ` - ${etape.groupe_machine}` : ''}`,
                    isLoading: false,
                    affectationId: etape.affectation_id,
                    numEtape: etape.num_etape,
                    numAffaire: affaire.num_affaire,
                    ficheId: fiche.id,
                    ficheName: fiche.titre,
                }))))
            }

            const machineColumns: BoardColumnType<PlanningMachineCard>[] = machines.data.map((machine) => ({
                id: machine.id,
                title: machine.nom_machine,
                meta: {
                    fonctionnelle: machine.fonctionnelle
                },
                cards: machine.affectations?.flatMap(affaire => affaire.fiches?.flatMap(fiche => fiche.etapes.map(etape => ({
                    id: etape.id,
                    title: <VStack alignItems='flex-start' gap={0}>
                        <HStack justifyContent='flex-start'>
                            {affaire.num_affaire && 
                                <Link to='/affaires/:numAffaire' params={{ numAffaire: String(affaire.num_affaire) }}>
                                    <TextLink>{affaire.num_affaire} /</TextLink>    
                                </Link>
                            }
                            {fiche.titre && <Text as='span'>{fiche.titre}</Text>}
                        </HStack>
                        <Text>n°{etape.num_etape} - {etape.temps}(h)</Text>
                    </VStack>,
                    isLoading: false,
                    affectationId: etape.affectation_id,
                    numEtape: etape.num_etape,
                    numAffaire: affaire.num_affaire,
                    ficheId: fiche.id,
                    ficheName: fiche.titre,
                    responsible: etape.user_id,
                }))) || [])
            })) || []

            setColumns([itemsToPlanColumn].concat(machineColumns))
            setCanProcess(false)
        }

    }, [machines, itemsToPlan])
    
	return <>
        <DashboardLayout
            title='Planning machines'
        >
            <Flex
                p='1em'
                w='100%'
            >
                {!columns &&
                    <Flex w='100%' justifyContent='center' alignItems='center' minH='70vh'>
                        <Spinner />
                    </Flex>
                }
                {columns &&
                    <Board
                        columns={columns || []}
                        setColumns={setColumns}
                        onCardMove={({ card, to, from }) => {

                            // Return if card is dropped in the same place
                            if (from.column.id === to.column.id && from.index === to.index) return
                            if (to.column.id === CUSTOM_FIRST_COLUMN_ID && from.column.id === CUSTOM_FIRST_COLUMN_ID) return

                            const toUnplan = to.column.id === CUSTOM_FIRST_COLUMN_ID,
                                  toPlan = from.column.id === CUSTOM_FIRST_COLUMN_ID

                            if (toPlan) {

                                fetchApiAffectationsMachinesCreate({
                                    body: {
                                        machine: to.column.id,
                                        etape: card.id,
                                        semaine_affectation: mockedSemaineAffectation,
                                    }
                                })
                                    .then(async () => {
                                        await Promise.all([
                                            machines.refetch(),
                                            itemsToPlan.refetch()
                                        ])
                                        setCanProcess(true)
                                        // toast.success('Affectation créée')
                                    })
                                    .catch(() => toast.error('Erreur lors de la création de l\'affectation'))

                            } else if (toUnplan) {

                                fetchApiAffectationsMachinesDestroy({ pathParams: { id: card.affectationId } })
                                    .then(async () => {
                                        await Promise.all([
                                            machines.refetch(),
                                            itemsToPlan.refetch()
                                        ])
                                        setCanProcess(true)
                                        // toast.success('Affectation supprimée')
                                    })
                                    .catch(() => toast.error('Erreur lors de la suppression de l\'affectation'))
                            } else {

                                fetchApiAffectationsMachinesPartialUpdate({
                                    pathParams: { id: card.affectationId },
                                    body: {
                                        previous: to.index === 0 ? null : to.column.cards[to.index - 1].affectationId,
                                        machine: toUnplan ? undefined : to.column.id,
                                    }
                                })
                                    .then(async () => {
                                        await machines.refetch()
                                        setCanProcess(true)
                                        // toast.success('Affectation modifiée')
                                    })
                                    .catch(() => toast.error('Erreur lors de la modification de l\'affectation'))
                            }
                        }}
                        firstColumnComponent={PlanningNestedEtapeColumn}
                        collapsable={{
                            cards: true,
                            columns: true
                        }}
                        renderCardBody={(card) => <Box mt='1em'>
                            <Select
                                size='sm'
                                placeholder='Choisir responsable'
                                defaultValue={card.responsible !== undefined ? {
                                    label: (() => {
                                        const employee = employees?.find(employee => employee.id === card.responsible)
                                        if (!employee) return 'N/A'
                                        return `${employee?.name?.charAt(0).toUpperCase()} ${employee?.surname}`
                                    })(),
                                    value: card.responsible
                                } : undefined}
                                options={employees?.map(employee => ({
                                    label: `${employee.name?.charAt(0).toUpperCase()} ${employee.surname}`,
                                    value: employee.id
                                })) || []}
                                onChange={(data) => {
                                    if (!data?.value || data.value === card.responsible) return

                                    fetchApiAffectationsMachinesPartialUpdate({
                                        pathParams: { id: card.affectationId },
                                        body: {
                                            user: data.value
                                        }
                                    })
                                        .then(async () => {
                                            await machines.refetch()
                                            setCanProcess(true)
                                            // toast.success('Responsable modifié')
                                        })
                                        .catch(() => toast.error('Erreur lors de la modification du responsable'))
                                }}
                            />
                        </Box>}
                        styling={{
                            column: (column) => {
                                if (column.meta?.fonctionnelle === false) {
                                    return {
                                        backgroundColor: 'red.200'
                                    }
                                }
                            }
                        }}
                    />
                }
            </Flex>
        </DashboardLayout>
    </>
}

export default PlanningMachinesPage
