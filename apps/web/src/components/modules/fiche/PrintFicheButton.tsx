import { Button, ThemeComponentProps } from '@chakra-ui/react'
import { fetchApiFichesExportRetrieve } from '@sgm/openapi'
import React from 'react'

type PrintFicheButtonProps = {
    ficheId: number
    buttonSize?: ThemeComponentProps['size']
}

export const PrintFicheButton: React.FC<PrintFicheButtonProps> = (props) => {

  const handleClick = async () => {
    const res = (await fetchApiFichesExportRetrieve({ queryParams: { fiche_id: props.ficheId }})) as { data: string ; headers: { 'content-disposition': string } } | undefined
    if (!res) return

    // cursed technique but hey, it works
    const url = window.URL.createObjectURL(new Blob([res.data])),
          fileName = res.headers['content-disposition'].split('filename=')[1].split(';')[0].replace(/"/g, '')

          const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); //
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
