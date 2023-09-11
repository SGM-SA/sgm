import { Button, HStack, Select, Text } from '@chakra-ui/react'
import { Table } from '@tanstack/react-table'
import React from 'react'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr'

type PaginationProps = {
    table: Table<any>,
}

const resultsPerPageOptions = [10, 25, 50, 100]

export const Pagination: React.FC<PaginationProps> = ({ table }) => {

    const onPreviousPage = () => table.previousPage()
    const onNextPage = () => table.nextPage()
    const changeResultsPerPage = (resultsPerPage: number) => table.setPageSize(resultsPerPage)
    // const onPageSelect = (pageNumber: number) => table.setPageIndex(pageNumber - 1)

	return <>
        <HStack mt='2em' w='100%' justifyContent='center' position='relative'>

            <HStack position='absolute' left='1em'>
                <Text fontSize='xs'>Résultats par page</Text>

                <Select size='xs' onChange={e => changeResultsPerPage(parseInt(e.target.value))}>
                    {resultsPerPageOptions.map(resultsPerPage =>
                        <option key={resultsPerPage} value={resultsPerPage}>
                            {resultsPerPage}
                        </option>
                    )}
                </Select>
            </HStack>

            <Button 
                aria-label='Page précédente' 
                onClick={onPreviousPage}
                disabled={table.getCanPreviousPage()}
                variant='unstyled'
                display='flex'
                fontWeight='normal'
            >
                <GrFormPrevious />
                Précédent
            </Button>

            <Text
                aria-label='Page actuelle'
                fontSize='sm'
                fontWeight='bold'
                mx='3em'
            >
                {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
            </Text>

            {/* {Array.from(Array(table.getPageCount()).keys()).map((pageNumber) => 
                <Button 
                    key={pageNumber} 
                    aria-label={`Page ${pageNumber + 1}`} 
                    onClick={() => onPageSelect(pageNumber + 1)}>
                    {pageNumber + 1}
                </Button>
            )} */}
            
            <Button 
                aria-label='Page suivante' 
                onClick={onNextPage}
                disabled={table.getCanNextPage()}
                variant='unstyled'
                display='flex'
                fontWeight='normal'
            >
                Suivant
                <GrFormNext />
            </Button>

        </HStack>
    </>
}