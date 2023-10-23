import { Box, HStack, Heading, VStack } from '@chakra-ui/react'
import { BaseBoardColumnProps, BoardCard, CollapsableElement } from '@sgm/ui'
import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { PlanningMachineCard } from '../../../pages/planning/machines'

type PlanningNestedEtapeColumnProps = BaseBoardColumnProps<PlanningMachineCard>

export const PlanningNestedEtapeColumn: React.FC<PlanningNestedEtapeColumnProps> = (props) => {

	return <>
            <Droppable
                droppableId={String(props.column.id)}
                key={String(props.column.id)}
            >
                {(provided, snapshot) => (
                    <Box
                        ref={provided.innerRef}
                        width='400px'
                        minWidth='400px'
                        minHeight='75vh' maxHeight='75vh'
                        bg='gray.100'
                        padding='1em'
                        borderRadius='5px'
                        overflowX='hidden'
                        overflowY='auto'
                        opacity={snapshot.isDraggingOver ? 0.8 : 1}
                        {...provided.droppableProps}
                    >

                        {/* Header */}
                        <VStack mb='1em'>
                            <HStack w='100%' justifyContent='space-between'>
                                <Heading as='h3' fontSize='1em'>{props.column.title}</Heading>
                                {/* {props.collapse && <FaChevronLeft onClick={toggleCollapse} cursor='pointer'/>} */}
                            </HStack>
                        </VStack>

                        {/* Cards */}
                        {groupEtapeByAffaireAndFiche(props.column.cards).map(affaire => (

                            <CollapsableElement
                                key={affaire.numAffaire}
                                title={`Affaire n°${affaire.numAffaire}`}
                                bg='white'
                                p='.5em'
                                borderRadius='2px'
                            >
                                {affaire.fiches.map(fiche => (

                                    <CollapsableElement
                                        key={fiche.id}
                                        title={fiche.name || fiche.id}
                                        bg='gray.100'
                                        p='.5em'
                                        mt='1em'
                                        borderRadius='2px'
                                    >
                                        {fiche.etapes.map(etape => (

                                            <BoardCard
                                                key={etape.id}
                                                index={props.column.cards.findIndex(item => item.id === etape.id)}
                                                card={etape}
                                                chakraProps={{
                                                    m: '0',
                                                    p: '.25em .5em',
                                                    mt: '1em'
                                                }}
                                                disableSortingAnimation={true}
                                                // title={}
                                                // renderCardBody={props.renderCard}
                                            />
                                        ))}
                                    </CollapsableElement>

                                ))}
                            </CollapsableElement>
                        ))}

                        <Box display='none'>
                            {provided.placeholder}
                        </Box>

                    </Box>
                )}

            </Droppable>
    </>
}

const groupEtapeByAffaireAndFiche = (cards: PlanningMachineCard[]) => {
    return cards.reduce<Array<{
        numAffaire: number
        fiches: Array<{
            id: number
            name?: string
            etapes: PlanningMachineCard[]
        }>
    }>>((acc, card) => {
        if (acc.find(item => item.numAffaire === card.numAffaire) === undefined && card.numAffaire) {
            acc.push({
                numAffaire: card.numAffaire,
                fiches: []
            })
        }
        if (acc.find(item => item.numAffaire === card.numAffaire)?.fiches.find(fiche => fiche.id === card.ficheId) === undefined && card.ficheId) {
            acc.find(item => item.numAffaire === card.numAffaire)?.fiches.push({
                id: card.ficheId,
                name: card.ficheName,
                etapes: []
            })
        }
        acc
            .find(affaire => affaire.numAffaire === card.numAffaire)
            ?.fiches
            .find(fiche => fiche.id === card.ficheId)
            ?.etapes
            .push(card)

        return acc
    }, [])
}
