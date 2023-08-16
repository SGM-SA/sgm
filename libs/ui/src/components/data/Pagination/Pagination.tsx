import { Button, HStack, IconButton } from '@chakra-ui/react'
import { Table } from '@tanstack/react-table'
import React from 'react'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr'

type PaginationProps = {
    table: Table<any>,
}

export const Pagination: React.FC<PaginationProps> = ({ table }) => {

    const onPreviousPage = () => table.previousPage()
    const onNextPage = () => table.nextPage()
    const onPageSelect = (pageNumber: number) => table.setPageIndex(pageNumber - 1)

	return <>
        <HStack>

            <IconButton 
                icon={<GrFormPrevious />} 
                aria-label='Page précédente' 
                onClick={onPreviousPage}
                disabled={table.getCanPreviousPage()}
            />
            
            {Array.from(Array(table.getPageCount()).keys()).map((pageNumber) => 
                <Button 
                    key={pageNumber} 
                    aria-label={`Page ${pageNumber + 1}`} 
                    onClick={() => onPageSelect(pageNumber + 1)}>
                    {pageNumber + 1}
                </Button>
            )}
            
            <IconButton 
                icon={<GrFormNext />} 
                aria-label='Page suivante' 
                onClick={onNextPage}
                disabled={table.getCanNextPage()}
            />

        </HStack>
    </>
}