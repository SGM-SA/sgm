import { Box, Table as ChakraTable, TableProps as ChakraTableProps, Checkbox, Flex, Icon, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { Paginated } from '@sgm/utils'
import { ColumnDef, PaginationState, Row, RowData, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table'
import React, { Fragment, ReactNode, useEffect, useMemo, useState } from 'react'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { resolveResults } from '../../../utils'
import { DefaultTableCell } from '../DefaultTableCell/DefaultTableCell'
import { Pagination } from '../Pagination/Pagination'
import { TableHeader } from '../TableHeader/TableHeader'
import { TableSubComponentLayout } from '../TableSubComponentLayout/TableSubComponentLayout'

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void
    }
}

// Give our default column cell renderer editing superpowers
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

type BaseTableProps<TData> = {
    columns: Array<any>
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
     * Row selection
     */
    rowSelection?: {
        enabled: boolean
        actionsComponent?: React.FC<{ checkedItems: Array<Row<TData>> }>
    }
    /**
     * Header
     */
    title?: string
    customHeader?: ReactNode
    /**
     * Styling
     */
    styling?: {
        table?: ChakraTableProps
        container?: ChakraTableProps
    }
}

type TableProps<TData> = BaseTableProps<TData> & ({
        data?: Array<TData>
        /**
         * Pagination
         */
        pagination?: undefined
    } | {
        data?: Paginated<TData>
        /**
         * Pagination
         */
        pagination: PaginationState,
        setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>
    })


export function Table<TData>(props: TableProps<TData>) {

    const [_, skipAutoResetPageIndex] = useSkipper()

    // link the pagination react state to the table internal state
    const tablePagination = useMemo(
        () => (props.pagination ? {
            ...props.pagination,
        } : undefined),
        [props.pagination]
    )

    const rowSelectionColumn: ColumnDef<TData> | undefined = props.rowSelection?.enabled ? {
        id: 'select',
            header: ({ table }) => (
                <Checkbox
                    isChecked={table.getIsAllRowsSelected()}
                    isIndeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <Checkbox
                        isChecked={row.getIsSelected()}
                        isIndeterminate={row.getIsSomeSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        disabled={!row.getCanSelect()}
                    />
                </div>
            ),
        } : undefined

    const table = useReactTable({
        data: resolveResults(props.data) || [],
        columns: rowSelectionColumn ? [rowSelectionColumn].concat(props.columns) : props.columns,
        state: {
            pagination: tablePagination,
        },
        getCoreRowModel: getCoreRowModel(),
        getRowCanExpand: () => !!props.rowCanExpand,
        ...(props.pagination ? {
            manualPagination: true,
            onPaginationChange: props.setPagination,
            pageCount: (props.data?.count && tablePagination) ? Math.ceil(props.data.count / tablePagination.pageSize) : 0,
        } : {}),
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
        <TableContainer 
            w='100%' minH='70vh' 
            display='flex' flexDirection='column' justifyContent='space-between' alignItems='center' 
            {...props.styling?.container}
        >
            
            <Box w='100%' position='relative'>

                {props.rowSelection?.actionsComponent &&
                    <Flex 
                        justifyContent='flex-end' alignItems='center'
                        w='100%' h={(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) ? 'unset' : 0} 
                        transition='all .5s ease-in-out'
                        // background='rgba(0,0,0,.1)'
                        overflow='hidden'
                        position='absolute' top={0} left={0}
                    >
                        <props.rowSelection.actionsComponent checkedItems={table.getIsAllRowsSelected() ? table.getRowModel().rows : table.getRowModel().rows.filter(row => row.getIsSelected())}/>
                    </Flex>
                }

                <TableHeader
                    title={props.title}
                >
                    {props.customHeader}
                </TableHeader>
            </Box>

            <ChakraTable
                size='sm'
                {...props.styling?.table}
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
                                        <Icon as={FaChevronDown} fontSize='xs'/>
                                        :
                                        <Icon as={FaChevronRight} fontSize='xs'/>
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
                                <Td 
                                    colSpan={row.getVisibleCells().length + 2}
                                    p={0}
                                >
                                    <TableSubComponentLayout>
                                        {props.renderSubComponent({ row })}
                                    </TableSubComponentLayout>
                                </Td>
                            </Tr>
                        )}
                    </Fragment>))}
                </Tbody>

            </ChakraTable>

            {props.pagination && 
                <Pagination
                    table={table}
                />
            }

        </TableContainer>
    </>
}