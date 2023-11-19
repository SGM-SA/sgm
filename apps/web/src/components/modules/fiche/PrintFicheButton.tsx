import { Button, ThemeComponentProps } from '@chakra-ui/react'
import { environment } from '@sgm/web/environments'

import React from 'react'

type PrintFicheButtonProps = {
    ficheId: number
    buttonSize?: ThemeComponentProps['size']
}

export const PrintFicheButton: React.FC<PrintFicheButtonProps> = (props) => {

  const handleClick = async () => {
    // Note: this is a hack to download the file, i could not use blob because of codegen
      const link = document.createElement('a')
      link.href = `${environment.apiBaseUrl}${"/api/fiches/export"}?fiche_id=${props.ficheId}`
      link.target = '_blank'
      link.download = 'fiche.pdf'
    link.click()
      link.remove()

  }

	return <>
        <Button
            size={props.buttonSize || 'sm'}
            colorScheme='blue'
            borderRadius='4px'
            variant='outline'
            onClick={handleClick}
        >
            Imprimer
        </Button>
    </>
}
