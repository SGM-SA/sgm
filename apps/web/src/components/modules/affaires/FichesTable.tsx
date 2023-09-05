import { Box, Progress } from '@chakra-ui/react'
import { AffaireDetails, FicheDetail, useApiAffairesFichesRetrieve } from '@sgm/openapi'
import { Table, createMeta } from '@sgm/ui'
import { Row, createColumnHelper } from '@tanstack/react-table'
import React from 'react'

type FichesTableProps = {
    affaireId: number
}

const columnHelper = createColumnHelper<FicheDetail>()

const columns = [
    columnHelper.accessor('num_affaire', {
        id: 'numero',
        header: 'Numéro',
    }),
    columnHelper.accessor('description', {
        id: 'description',
        header: 'Description',
        meta: createMeta({
            editable: true,
            type: 'text'
        })
    }),
    columnHelper.accessor('avancement_fiche', {
        id: 'avancement',
        header: 'Avancement',
        cell: value => <Box>
            <Box as='span' fontSize='xs'>{value.getValue()}%</Box>
            <Progress value={value.getValue()} 
                background='#c7d2fe'
                borderRadius='10px'
                size='sm'
                mt='.5em'
            />
        </Box>,
    }),
    columnHelper.accessor('fourniture', {
        id: 'fourniture',
        header: 'Fournitures',
        meta: createMeta({
            editable: true,
            type: 'boolean'
        })
    }),
    columnHelper.accessor('terminee', {
        id: 'terminee',
        header: 'Terminée',
        meta: createMeta({
            editable: true,
            type: 'boolean'
        })
    }),
]

export const FichesTable: React.FC<FichesTableProps> = (props) => {

    const { data } = useApiAffairesFichesRetrieve({ pathParams: { id: props.affaireId } })

	return <Box className='not-striped'>
        <Table<FicheDetail>
            data={data?.fiches || []}
            columns={columns}
            title='Fiches'
            editable={true}
            rowSelection={{
                enabled: true,
                actionsComponent: ({ checkedItems }) => {
                    return <Box>
                        {checkedItems.length} items selected
                    </Box>
                }

            }}
            styling={{
                container: {
                    minHeight: 'unset'
                },
                table: {
                    variant: 'unstyled'
                }
            }}
        />     
    </Box>
}