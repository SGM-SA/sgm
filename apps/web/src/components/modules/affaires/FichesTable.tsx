import { AffaireDetails, FicheDetail, useApiAffairesFichesRetrieve } from '@sgm/openapi'
import { Table } from '@sgm/ui'
import { Row, createColumnHelper } from '@tanstack/react-table'
import React from 'react'

type FichesTableProps = {
    row: Row<AffaireDetails>
}

const columnHelper = createColumnHelper<FicheDetail>()

const columns = []

export const FichesTable: React.FC<FichesTableProps> = (props) => {

    const affaires = useApiAffairesFichesRetrieve({ pathParams: { id: props.row.original.id } })

	return <>
        <Table<FicheDetail>
            data={affaires.data?.fiches || []}
            columns={[]}
        />     
    </>
}