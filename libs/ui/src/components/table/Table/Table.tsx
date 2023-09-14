import { Box, Table as ChakraTable, TableProps as ChakraTableProps, Checkbox, Flex, Icon, IconButton, Skeleton, Spinner, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { Paginated } from '@sgm/utils'
import { ColumnDef, PaginationState, Row, RowData, SortingState, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table'
import React, { Fragment, MouseEvent, MouseEventHandler, useEffect, useMemo, useState } from 'react'
import { FaArrowDown, FaArrowUp, FaChevronDown, FaChevronRight, FaPlus } from 'react-icons/fa'
import { RowSelectionActionComponentProps, getMetaFromColumn, resolveResults } from '../../../utils'
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
    loading: boolean
    /**
     * Row expansion
     */
    rowExpansion?: {
        enabled: boolean
        renderSubComponent?: React.FC<{ row: Row<TData> }>
    }
    /**
     * Editable
     */
    editable?: boolean
    /**
     * Sortable
     */
    sorting?: string
    setSorting?: React.Dispatch<React.SetStateAction<string>>
    /**
     * Row selection
     */
    rowSelection?: {
        enabled: boolean
        selectionActionComponent?: RowSelectionActionComponentProps<TData>
    }
    /**
     * Row behavior
     */
    rowAction?: {
        enableDoubleClick?: boolean
        enableCtrlClick?: boolean
        actionFn: (row: Row<TData>, options: {
            isCtrlKey: boolean
            isDoubleClick: boolean
        }) => void
    }
    /**
     * New row
     */
    newRow?: () => void
    /**
     * Header
     */
    header?: {
        title?: string
        customHeader?: React.FC
    }
    /**
     * Styling
     */
    styling?: {
        table?: ChakraTableProps
        container?: ChakraTableProps
    }
    /**
     * Misc
     */
    loadingSkeletonRowsCount?: number
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
        pagination: PaginationState
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


    const [internalSorting, setInternalSorting] = useState<SortingState>([])
    
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


    const data = resolveResults(props.data) || [],
          columns = rowSelectionColumn ? [rowSelectionColumn].concat(props.columns) : props.columns,
          loadingSkeletonRowsCount = props.loadingSkeletonRowsCount || props.pagination?.pageSize || 10

    const table = useReactTable<TData>({
        data: props.loading ? Array(loadingSkeletonRowsCount).fill({}) : data,
        columns: props.loading ? columns.map(column => ({
            ...column,
            cell: () => <Skeleton height='2em'/>
        })) : columns,
        state: {
            pagination: tablePagination,
            sorting: internalSorting
        },
        getCoreRowModel: getCoreRowModel(),
        getRowCanExpand: () => !!props.rowExpansion?.enabled,
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
        } : {}),
        ...(props.sorting !== undefined ? {
            manualSorting: true,
            onSortingChange: setInternalSorting,
        } : {})
    })

    const getTrProps = (row: Row<TData>) => ({
        ...(props.rowAction?.enableDoubleClick ? {
            onDoubleClick: (e: MouseEvent<HTMLTableRowElement>) => {
                props.rowAction?.actionFn(row, {
                    isCtrlKey: e.ctrlKey,
                    isDoubleClick: true
                })
            }
        } : {}),
        ...(props.rowAction?.enableCtrlClick ? {
            onClick: (e: MouseEvent<HTMLTableRowElement>) => {
                if (e.ctrlKey) {
                    console.log(e.currentTarget)
                    props.rowAction?.actionFn(row, {
                        isCtrlKey: e.ctrlKey,
                        isDoubleClick: false
                    })
                }
            }
        } : {})
    })

    useEffect(() => {
        
        if (internalSorting[0] && props.setSorting) {
            const [{ id, desc }] = internalSorting
            props.setSorting(`${desc ? '-' : ''}${id}`)
        }

    }, [internalSorting])

	return <>
        <TableContainer 
            w='100%' minH='70vh'
            display='flex' flexDirection='column' justifyContent='flex-start' alignItems='center' 
            {...props.styling?.container}
        >
            
            <Box w='100%' position='relative'>

                {props.rowSelection?.selectionActionComponent &&
                    <Flex 
                        justifyContent='flex-end' alignItems='center'
                        w='100%' h={(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) ? 'unset' : 0} 
                        transition='all .5s ease-in-out'
                        // background='rgba(0,0,0,.1)'
                        overflow='hidden'
                        position='absolute' top={0} left={0}
                    >
                        <props.rowSelection.selectionActionComponent 
                            checkedItems={table.getIsAllRowsSelected() ? table.getRowModel().rows : table.getRowModel().rows.filter(row => row.getIsSelected())}
                            resetSelection={() => table.toggleAllPageRowsSelected(false)}
                    />
                    </Flex>
                }

                <TableHeader
                    title={props.header?.title}
                >
                    {props.header?.customHeader &&
                        <props.header.customHeader />
                    }
                </TableHeader>
            </Box>

            <ChakraTable
                size='sm'
                mb='auto'
                {...props.styling?.table}
            >
                
                <Thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Tr key={headerGroup.id}>
                            {props.rowExpansion?.enabled && <Th></Th>}
                            {headerGroup.headers.map(header => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    <Box
                                        {...(header.column.getCanSort() && getMetaFromColumn(header.column)?.sortable ? {
                                            cursor: 'pointer',
                                            onClick: header.column.getToggleSortingHandler(),
                                        } : {}) }
                                    >
                                        {/* Render the column header */}
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        }
                                        {/* Sorting icon */}
                                        {{
                                            asc: <Icon as={FaArrowDown} ml='.5em' />,
                                            desc: <Icon as={FaArrowUp} ml='.5em' />,
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </Box>
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>

                <Tbody>
                    {/* {!props.loading &&
                        <Tr w='100%'>
                            <Flex
                                w='100%' minH='50vh'
                                justifyContent='center' alignItems='center'
                            >
                                <Spinner />
                            </Flex>
                        </Tr>
                    } */}
                        {table.getRowModel().rows.map(row => (<Fragment key={row.id}>
                    
                            <Tr {...getTrProps(row)}>

                                {props.rowExpansion?.enabled && (
                                    props.loading ? 
                                    <Td></Td>
                                    :
                                    <Td onClick={row.getCanExpand() ? row.getToggleExpandedHandler() : undefined}
                                        _hover={{ cursor: row.getCanExpand() ? 'pointer' : undefined }}
                                    >
                                        {row.getIsExpanded() ? 
                                            <Icon as={FaChevronDown} fontSize='xs'/>
                                            :
                                            <Icon as={FaChevronRight} fontSize='xs'/>
                                        }
                                    </Td>
                                )}
                                {row.getVisibleCells().map(cell => (
                                    <Td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                            )}
                                    </Td>
                                ))}
                            </Tr>

                            {(row.getIsExpanded() && props.rowExpansion?.renderSubComponent) && (
                                <Tr {...getTrProps(row)}>
                                    <Td 
                                        colSpan={row.getVisibleCells().length + 2}
                                        p={0}
                                    >
                                        <TableSubComponentLayout>
                                            {props.rowExpansion.renderSubComponent({ row })}
                                        </TableSubComponentLayout>
                                    </Td>
                                </Tr>
                            )}
                        </Fragment>))}
                </Tbody>

            </ChakraTable>

            {props.newRow &&
                
                <IconButton 
                    onClick={props.newRow} 
                    icon={<FaPlus />} 
                    aria-label='Ajouter un élément' 
                    size='xs'
                    w='100%'
                    variant='ghost'
                    mt='1em'
                />
            }

            {props.pagination && 
                <Pagination
                    table={table}
                />
            }

        </TableContainer>
    </>
}