import { Button, Textarea, VStack } from '@chakra-ui/react'
import { NoteDetail, fetchApiNotesCreate } from '@sgm/openapi'
import React, { KeyboardEvent, useRef } from 'react'
import { AffaireNote } from './AffaireNote'

type AffaireNotesProps = {
    notes: NoteDetail[]
    affaireId: number
    refetch: () => void
}

export const AffaireNotes: React.FC<AffaireNotesProps> = (props) => {

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const onEnterPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            addNote(textareaRef.current?.value)
        }
    }

    const resetTextArea = () => {
        if (textareaRef.current) textareaRef.current.value = ''
    }

    const addNote = (content?: string) => {
        if (content) {
            fetchApiNotesCreate({
                body: {
                    affaire: props.affaireId,
                    contenu: content, 
                }
            })
            .then(() => {
                resetTextArea()
                props.refetch()
            })
        }
    }

	return <VStack
        spacing={4}
        w='100%'
    >
        
        {/* Display notes */}
        {props.notes.map(note => <AffaireNote key={note.user + note.date_creation} note={note} />)}

        {/* Add note */}
        <VStack w='100%'>
            <Textarea 
                ref={textareaRef}
                placeholder='Ajouter une note' 
                variant='filled'
                onKeyDown={onEnterPress}
            />
            <Button colorScheme='blue' alignSelf='flex-end' onClick={() => addNote(textareaRef.current?.value)}>Envoyer</Button>
        </VStack>
        
    </VStack>
}