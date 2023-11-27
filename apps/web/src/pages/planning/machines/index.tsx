import { Button, Flex, HStack, Icon, Input, Spinner, Text, VStack } from '@chakra-ui/react'
import { fetchApiAffectationsMachinesCreate, fetchApiAffectationsMachinesDestroy, fetchApiAffectationsMachinesPartialUpdate, fetchApiGroupeMachineList, fetchApiSalariesFormOptionsList, useApiFichesMachineAPlanifierList, useApiPlanningMachineList } from '@sgm/openapi'
import { BaseBoardCardType, Board, BoardColumnType, CUSTOM_FIRST_COLUMN_ID, TextLink } from '@sgm/ui'
import { Link } from '@sgm/web/router'
import { Select } from 'chakra-react-select'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { LoaderFunction } from 'react-router-dom'
import { useLoaderData } from 'react-router-typesafe'
import { toast } from 'react-toastify'
import { DashboardLayout } from '../../../components/layouts'
import { PlanningNestedEtapeColumn } from '../../../components/modules'
import { environment } from '@sgm/web/environments'

export const Loader = (() => {
    return Promise.all([
        fetchApiSalariesFormOptionsList({}),
        fetchApiGroupeMachineList({})
    ])
}) satisfies LoaderFunction

export type PlanningMachineCard = BaseBoardCardType & {
    numEtape: number
    affectationId?: number
    numAffaire?: number | null
    ficheId: number
    ficheName?: string
    responsible?: number
}

const PlanningMachinesPage: React.FC = () => {

    const [employees, groupesMachines] = useLoaderData<typeof Loader>()

    const [date, setDate] = useState(dayjs())
    const machines = useApiPlanningMachineList({ queryParams: { date: date.format('YYYY-MM-DD') } })
    const itemsToPlan = useApiFichesMachineAPlanifierList({})
    const [canProcess, setCanProcess] = useState(true)

    const [columns, setColumns] = useState<BoardColumnType<PlanningMachineCard>[] | undefined>(undefined)

    useEffect(() => {

        if (machines.data && itemsToPlan.data && canProcess) {

            const itemsToPlanColumn: BoardColumnType<PlanningMachineCard> = {
                id: CUSTOM_FIRST_COLUMN_ID,
                title: 'A planifier',
                cards: itemsToPlan.data.flatMap(affaire => affaire.fiches.flatMap(fiche => fiche.etapes.map(etape => {

                    const groupeMachine = groupesMachines.results?.find(groupeMachine => groupeMachine.id === etape.groupe_machine)

                    return {
                        id: etape.id,
                        title: `Etape n°${etape.num_etape}${etape.temps ? ` - ${etape.temps * etape.quantite! }h` : ''}${groupeMachine ? ` - ${groupeMachine.nom_groupe}` : ''}`,
                        isLoading: false,
                        numEtape: etape.num_etape,
                        numAffaire: affaire.num_affaire,
                        ficheId: fiche.id,
                        ficheName: fiche.titre,
                    }
                })))
            }

            const machineColumns: BoardColumnType<PlanningMachineCard>[] = machines.data.map((machine) => ({
                id: machine.id,
                title: machine.nom_machine,
                meta: {
                    fonctionnelle: machine.fonctionnelle,
                    heuresTravail: {
                      dispo: machine.heures_travail_dispo,
                      affectees: machine.heures_travail_affectees,
                    }
                },
                cards: machine.affectations?.flatMap(affaire => affaire.fiches?.flatMap(fiche => fiche.etapes.map(etape => ({
                    id: etape.id,
                    title: <VStack alignItems='flex-start' gap={0}>
                        <HStack justifyContent='flex-start'>
                            {affaire.num_affaire && <>
                                <Link to='/affaires/:numAffaire' params={{ numAffaire: String(affaire.num_affaire) }}>
                                    <TextLink>{affaire.num_affaire}</TextLink>
                                </Link>
                                /
                            </>}
                            {fiche.titre &&
                                <Link to='/affaires/:numAffaire/fiches/:id' params={{ numAffaire: String(affaire.num_affaire), id: String(fiche.id) }}>
                                    <TextLink>{fiche.titre}</TextLink>
                                </Link>
                            }
                        </HStack>
                        <Text>n°{etape.num_etape} - {etape.temps! * etape.quantite!}h</Text>
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

    useEffect(() => {
        setCanProcess(true) // TODO: check if it is still working with network latency
    }, [date])

	  return <>
        <DashboardLayout
            title='Planning machines'
            customHeader={
                <Flex h='100%' alignContent='flex-end' flexWrap='wrap' mb='1em'>
                  <Input
                      type='date'
                      value={date.format('YYYY-MM-DD')}
                      onChange={(e) => setDate(dayjs(e.target.value))}
                      p='.5em'
                      bg='white !important'
                      w='auto'
                      variant='filled'
                      fontSize='sm'
                      color='black'
                  />
                </Flex>
            }
            styling={{
                removeTitleMarginBottom: true
            }}
        >
            <VStack
                p='1em'
                w='100%'
                alignItems='flex-start'
            >
                {!columns &&
                    <Flex w='100%' justifyContent='center' alignItems='center' minH='70vh'>
                        <Spinner />
                    </Flex>
                }
                {columns && <>

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
                                        semaine_affectation: date.format('YYYY-MM-DD'),
                                        previous: to.index === 0 ? null : to.column.cards[to.index - 1].affectationId,
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
                                if (!card.affectationId) return

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
                                if (!card.affectationId) return

                                let previousIndex: number
                                if (to.column.id === from.column.id) {
                                    if (to.index > from.index) previousIndex = to.index
                                    else previousIndex = to.index - 1
                                } else {
                                    previousIndex = to.index - 1
                                }

                                fetchApiAffectationsMachinesPartialUpdate({
                                    pathParams: { id: card.affectationId },
                                    body: {
                                        previous: to.index === 0 ? null : to.column.cards[previousIndex].affectationId,
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
                        custom={{
                          columnFooter: (column) => {
                            return <Text fontSize='sm'>
                              {column.meta.heuresTravail.affectees} / {column.meta.heuresTravail.dispo}h
                            </Text>
                          },
                          columnHeader: (column) => {
                            return <HStack
                                w='60%'
                                justifyContent='flex-end'
                            >
                                <Button as='a' 
                                    href={`${environment.apiBaseUrl}/api/planning/machine/pdf?id=${column.id}&semaine_affectation=${dayjs(date).format('YYYY-MM-DD')}`}
                                    target='_blank'
                                    size='sm'   
                                >    
                                    Imprimer
                                </Button>
                            </HStack>
                          },
                          firstColumn: PlanningNestedEtapeColumn,
                          cardBody: (card) => {
                            return <HStack mt='1em' w='100%' alignItems='center'>
                              <Select
                                // @ts-ignore
                                size='xs'
                                className='full-width'
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
                                    if (!data?.value || data.value === card.responsible || !card.affectationId) return

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
                              <Icon as={FiTrash2}
                                width='2.5em'
                                ml='.5em'
                                height='1.25em'
                                color='red'
                                cursor='pointer'
                                onClick={() => {
                                  if (!card.affectationId) return

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
                                }}
                              />
                            </HStack>
                          },
                        }}
                        collapsable={{
                            columns: true,
                            cards: true
                        }}
                        styling={{
                            column: (column) => {
                                if (column.meta?.fonctionnelle === false) {
                                    return {
                                        border: '2px solid',
                                        borderColor: 'red.300 !important'
                                    }
                                }
                            }
                        }}
                    />
                </>}
            </VStack>
        </DashboardLayout>
    </>
}

export default PlanningMachinesPage
