import { ChakraProps, Table as ChakraTable, TableProps as ChakraTableProps, Icon, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { Paginated } from '@sgm/utils'
import { ColumnDef, PaginationState, Row, RowData, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table'
import React, { Fragment, useMemo } from 'react'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { DefaultTableCell } from '../DefaultTableCell/DefaultTableCell'
import { Pagination } from '../Pagination/Pagination'

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void
    }
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<any>> = {
    cell: DefaultTableCell,
}

const useSkipper = () => {

    const shouldSkipRef = React.useRef(true)
    const shouldSkip = shouldSkipRef.current
  
    // Wrap a function with this to skip a pagination reset temporarily
    const skip = React.useCallback(() => {
        shouldSkipRef.current = false
    }, [])
  
    React.useEffect(() => {
        shouldSkipRef.current = true
    })
  
    return [shouldSkip, skip] as const
}

enum RowsPerPage {
    Ten = 10,
    TwentyFive = 25,
    Fifty = 50,
    OneHundred = 100
}

type TableProps<TData> = {
    columns: Array<any>
    data?: Paginated<TData>
    /**
     * Pagination
     */
    pagination: PaginationState,
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
    /**
     * Row expansion
     */
    rowCanExpand?: boolean
    renderSubComponent?: React.FC<{ row: Row<TData> }>
    /**
     * Editable
     */
    editable?: boolean
    /**
     * Styling
     */
    chakraProps?: ChakraTableProps
}

export function Table<TData>(props: TableProps<TData>) {

    const [_, skipAutoResetPageIndex] = useSkipper()

    // link the pagination react state to the table internal state
    const tablePagination = useMemo(
        () => ({
            ...props.pagination,
        }),
        [props.pagination]
    )

    const table = useReactTable({
        data: props.data?.results?.slice(0, 2) || [],
        columns: props.columns,
        state: {
            pagination: tablePagination,
        },
        manualPagination: true,
        onPaginationChange: props.setPagination,
        pageCount: props.data?.count ? Math.ceil(props.data.count / tablePagination.pageSize) : 0,
        getCoreRowModel: getCoreRowModel(),
        getRowCanExpand: () => !!props.rowCanExpand,
        getExpandedRowModel: getExpandedRowModel(),
        ...(props.editable ? {
            defaultColumn,
            meta: {
                updateData: (rowIndex, columnId, value) => {
                    // Skip page index reset until after next rerender
                    skipAutoResetPageIndex()
                    console.log('updateData', rowIndex, columnId, value)
                }
            }
        } : {})
    })

	return <>
        <TableContainer w='100%' minH='70vh' display='flex' flexDirection='column' justifyContent='space-between'>
            <ChakraTable
                size='sm'
                {...props.chakraProps}
            >
                <Thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Tr key={headerGroup.id}>
                            {props.rowCanExpand && <Th></Th>}
                            {headerGroup.headers.map(header => (
                                <Th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody>
                    {table.getRowModel().rows.map(row => (<Fragment key={row.id}>
                    
                        <Tr>
                            {props.rowCanExpand && 
                                <Td onClick={row.getCanExpand() ? row.getToggleExpandedHandler() : undefined}
                                    _hover={{ cursor: row.getCanExpand() ? 'pointer' : undefined }}
                                >
                                    {row.getIsExpanded() ? 
                                        <Icon as={FaChevronDown} />
                                        :
                                        <Icon as={FaChevronRight} />
                                    }
                                </Td>
                            }
                            {row.getVisibleCells().map(cell => (
                                <Td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                        )}
                                </Td>
                            ))}
                        </Tr>
                        {(row.getIsExpanded() && props.renderSubComponent) && (
                            <Tr>
                                <Td colSpan={row.getVisibleCells().length}>
                                    {props.renderSubComponent({ row })}
                                </Td>
                            </Tr>
                        )}
                    </Fragment>))}
                </Tbody>
            </ChakraTable>
            <Pagination
                table={table}
            />
        </TableContainer>
    </>
}