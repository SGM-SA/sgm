import { Button, ThemeComponentProps } from '@chakra-ui/react'
import React from 'react'

type PrintFicheButtonProps = {
    ficheId: number
    buttonSize?: ThemeComponentProps['size']
}

export const PrintFicheButton: React.FC<PrintFicheButtonProps> = (props) => {

	return <>
        <Button
            size={props.buttonSize || 'sm'}
            colorScheme='blue'
            borderRadius='4px'
            variant='outline'
            onClick={() => {
                // TODO: implement
                window.print() // temporary
            }}
        >
            Imprimer
        </Button>
    </>
}