import { fetchApiAffectationsMachinesPartialUpdate, fetchApiSalariesFormOptionsList, useApiPlanningMachineList } from '@sgm/openapi'
import { BaseBoardCardType, Board, BoardColumnType, TextLink } from '@sgm/ui'
import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '../../../components/layouts'
import { Flex, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import { Link } from '@sgm/web/router'
import { Select } from 'chakra-react-select'
import { LoaderFunction } from 'react-router-dom'
import { useLoaderData } from 'react-router-typesafe'
import { toast } from 'react-toastify'
import { PlanningNestedEtapeColumn } from '../../../components/modules'

export const Loader = (() => {
    return fetchApiSalariesFormOptionsList({ queryParams: { per_page: 1000 } })
}) satisfies LoaderFunction

export type PlanningMachineCard = BaseBoardCardType & {
    affectationId: number
    numEtape: number
    numAffaire?: number | null
    ficheId: number
    ficheName?: string
    responsible?: number
    temps?: number
    groupeMachineId?: number | null
} 

const PlanningMachinesPage: React.FC = () => {

    const employees = useLoaderData<typeof Loader>()

    const machines = useApiPlanningMachineList({
        queryParams: {
            date: '2023-10-13'
        }
    })

    const [columns, setColumns] = useState<BoardColumnType<PlanningMachineCard>[] | undefined>(undefined)

    useEffect(() => {
        
        if (machines.data && columns === undefined) {

            const computedColumns: BoardColumnType<PlanningMachineCard>[] = machines.data.map((machine) => ({
                id: machine.id,
                title: machine.nom_machine,
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
                    affectationId: etape.affectation_id,
                    numEtape: etape.num_etape,
                    numAffaire: affaire.num_affaire,
                    ficheId: fiche.id,
                    ficheName: fiche.titre,
                    responsible: etape.user_id,
                    temps: etape.temps,
                    groupeMachineId: etape.groupe_machine
                }))) || [])
            })) || []

            // console.log('columns', computedColumns)

            setColumns(computedColumns)
        }

    }, [machines, columns])

	return <>
        <DashboardLayout
            title='Planning machines'
        >
            <Flex
                p='1em'
            >
                {!columns && <Spinner />}
                {columns &&
                    <Board
                        columns={columns || []}
                        onCardMove={(card, to) => {
                            fetchApiAffectationsMachinesPartialUpdate({
                                pathParams: { id: card.affectationId },
                                body: {
                                    previous: to.index === 0 ? null : to.column.cards[to.index - 1].id,
                                    machine: to.column.id
                                }
                            })
                                .then(() => {
                                    machines.refetch()
                                    toast.success('Affectation modifiée')
                                })
                                .catch(() => toast.error('Erreur lors de la modification de l\'affectation'))
                        }}
                        firstColumnComponent={PlanningNestedEtapeColumn}
                        collapsable={{
                            cards: true,
                            columns: true
                        }}
                        renderCardBody={(card) => <>
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
                                        .then(() => {
                                            machines.refetch()
                                            toast.success('Responsable modifié')
                                        })
                                        .catch(() => toast.error('Erreur lors de la modification du responsable'))
                                }}
                            />
                        </>}
                    />
                }
            </Flex>
        </DashboardLayout>
    </>
}

export default PlanningMachinesPage
