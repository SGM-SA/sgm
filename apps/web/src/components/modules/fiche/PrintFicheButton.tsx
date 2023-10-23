import { Button, ThemeComponentProps } from '@chakra-ui/react'
import { fetchApiFichesExportRetrieve } from '@sgm/openapi'
import React from 'react'

type PrintFicheButtonProps = {
    ficheId: number
    buttonSize?: ThemeComponentProps['size']
}

export const PrintFicheButton: React.FC<PrintFicheButtonProps> = (props) => {

  const handleClick = async () => {
    const res = (await fetchApiFichesExportRetrieve({ queryParams: { fiche_id: props.ficheId }})) as string | undefined
    if (!res) return

    // cursed technique but hey, it works
    const url = window.URL.createObjectURL(new Blob([res]))
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', new Date().toISOString()); //
    document.body.appendChild(link);
    link.click();
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
