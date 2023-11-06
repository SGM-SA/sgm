import { HStack, Text, Tooltip, VStack } from '@chakra-ui/react'
import { NoteDetail } from '@sgm/openapi'
import { dayjs } from '@sgm/utils'
import React from 'react'

type AffaireNoteProps = {
    note: NoteDetail
}

export const AffaireNote: React.FC<AffaireNoteProps> = (props) => {

    const timeFromNoteCreation = dayjs(props.note.date_creation).fromNow()
    const readableDate = dayjs(props.note.date_creation).format('DD/MM/YYYY HH:mm')

	return <VStack
        alignItems='flex-start'
        w='100%'
        p='1em'
        border='1px solid rgba(55, 53, 47, 0.09)'
        borderRadius='3px'
        _hover={{
            bg: 'gray.50',
        }}
        spacing={0}
    >

        {/* Header */}
        <HStack>
            <Text fontWeight='bold' fontSize='.9em'>{props.note.user}</Text>
            <Tooltip label={readableDate}>
                <Text color='gray' fontSize='.8em'>{timeFromNoteCreation}</Text>
            </Tooltip>
        </HStack>

        <Text fontSize='.9em'>{props.note.contenu}</Text>

    </VStack>
}