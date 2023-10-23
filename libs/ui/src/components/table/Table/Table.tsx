import { Box, ChakraProps, Table as ChakraTable, TableProps as ChakraTableProps, Checkbox, Icon, IconButton, Skeleton, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { Paginated, createObjectFromPath } from '@sgm/utils'
import { ColumnDef, DeepKeys, PaginationState, Row, RowData, SortingState, flexRender, getCoreRowModel, getExpandedRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import React, { Fragment, MouseEvent, useEffect, useMemo, useState } from 'react'
import { FaArrowDown, FaArrowUp, FaChevronDown, FaChevronRight, FaPlus } from 'react-icons/fa'
import { RowSelectionActionComponentProps, getMetaFromColumn, resolveResults } from '../../../utils'
import { DefaultTableCell } from '../DefaultTableCell/DefaultTableCell'
import { Pagination } from '../Pagination/Pagination'
import { TableSubComponentLayout } from '../TableSubComponentLayout/TableSubComponentLayout'

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (row: Row<TData>, accessorKey: DeepKeys<TData>, value: unknown) => void
    }
}

// Give the default column cell renderer editing superpowers
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
    /**
     * The \@tanstack/react-table columns definition
     * @doc https://tanstack.com/table/v8/docs/guide/column-defs
     */
    columns: Array<any>
    /**
     * Is the table is currently loading and should then display a skeleton loader
     */
    loading: boolean
    /**
     * Permit to display a sub component underneath any row of the table accessible using an expansion button
     */
    rowExpansion?: {
        enabled: boolean
        expandedByDefault?: boolean
        renderComponent?: React.FC<{ row: Row<TData> }>
    }
    /**
     * Should the table cells be editable
     */
    editable?: {
        enabled: true,
        onRowUpdate: (row: Row<TData>, newData: Partial<TData>) => void
    }
    /**
     * If set to a boolean, the table will be sorted locally
     *
     * If set to an object with the state and setter from the `useTableQueryHelper` hook, the table will be sorted server side
     */
    sortable?: boolean | {
        state: string
        setState: React.Dispatch<React.SetStateAction<string>>
    }
    /**
     * Enable row selection using checkboxes
     */
    rowSelection?: {
        enabled: boolean
        selectionActionComponent?: RowSelectionActionComponentProps<TData>
    }
    /**
     * Controls the rows behavior and what action to perform on what event
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
     * If set, will display a button to add a new row according to the function passed
     */
    newRow?: () => void
    /**
     * Styling
     */
    styling?: {
        table?: ChakraTableProps
        row?: ChakraProps | ((row: Row<TData>) => ChakraProps | undefined)
    }
    /**
     * Overrides the number of rows displayed in the skeleton loader
     */
    loadingSkeletonRowsCount?: number
}

type TableProps<TData> = BaseTableProps<TData> & ({
        /**
         * Data to display
         */
        data?: Array<TData>
        /**
         * Pagination
         */
        pagination?: undefined
    } | {
        /**
         * Paginated data to display
         */
        data?: Paginated<TData>
        /**
         * Pagination state and setter from the `useTableQueryHelper` hook
         */
        pagination: {
            state: PaginationState
            setState?: React.Dispatch<React.SetStateAction<PaginationState>>
        }
    })


export function Table<TData>(props: TableProps<TData>) {

    const [_, skipAutoResetPageIndex] = useSkipper()

    // link the pagination react state to the table internal state
    const tablePagination = useMemo(
        () => (props.pagination ? {
            ...props.pagination.state,
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
                    borderColor='primary.50'
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <Checkbox
                        isChecked={row.getIsSelected()}
                        isIndeterminate={row.getIsSomeSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        disabled={!row.getCanSelect()}
                        borderColor='primary.50'
                    />
                </div>
            ),
        } : undefined


    const data = resolveResults(props.data) || [],
          columns = rowSelectionColumn ? [rowSelectionColumn].concat(props.columns) : props.columns,
          loadingSkeletonRowsCount = props.loadingSkeletonRowsCount || props.pagination?.state?.pageSize || 10

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
            onPaginationChange: props.pagination.setState,
            pageCount: (props.data?.count && tablePagination) ? Math.ceil(props.data.count / tablePagination.pageSize) : 0,
        } : {}),
        getExpandedRowModel: getExpandedRowModel(),
        ...(props.editable?.enabled ? {
            defaultColumn,
            meta: {
                updateData: (row, accessorKey, newValue) => {
                    // Skip page index reset until after next rerender
                    skipAutoResetPageIndex()

                    const newObject = createObjectFromPath<TData>(accessorKey, newValue)

                    props.editable?.onRowUpdate(row, newObject)
                }
            }
        } : {}),
        ...(isServerSorted(props.sortable) ? {
            manualSorting: true,
            onSortingChange: setInternalSorting,
        } : {}),
        ...(isLocalSorted(props.sortable) ? {
            manualSorting: false,
            onSortingChange: setInternalSorting,
            getSortedRowModel: getSortedRowModel(),
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
                    props.rowAction?.actionFn(row, {
                        isCtrlKey: e.ctrlKey,
                        isDoubleClick: false
                    })
                }
            }
        } : {})
    })

    useEffect(() => {

        if (internalSorting[0] && isServerSorted(props.sortable)) {
            const [{ id, desc }] = internalSorting
            props.sortable.setState(`${desc ? '-' : ''}${id}`)
        }

    }, [internalSorting, props.sortable])

    useEffect(() => {
        if (props.rowExpansion?.enabled && props.rowExpansion.expandedByDefault) {
            table.toggleAllRowsExpanded()
        }
    }, [])

    const selectedRowsCount = table.getRowModel().rows.filter(row => row.getIsSelected()).length

	return <>

            {(props.rowSelection?.selectionActionComponent && (table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())) &&
                <Box className='Toastify__toast-container Toastify__toast-container--bottom-center'
                    w='80%'
                    background='gray.50'
                    // justifyContent='center' alignItems='center'
                    // transition='all .5s ease-in-out'
                    // background='gray.50'
                    // borderRadius='5px'
                    // boxShadow='0 0 10px rgba(0,0,0,.2)'
                    // p='1em'
                    // overflow='hidden'
                    // position='fixed'
                    // bottom='5%' left='50%' transform='translateX(-50%)'
                    // zIndex={1}
                >
                    <Box className='Toastify__toast Toastify__toast-theme--light Toastify__toast--success'
                        display='flex'
                        justifyContent='space-between' alignItems='center'
                        paddingX='2em'
                    >
                        <Text>
                            {`${selectedRowsCount} lignes sélectionnée${selectedRowsCount > 1 ? 's' : ''}`}
                        </Text>
                        <props.rowSelection.selectionActionComponent
                            checkedItems={table.getIsAllRowsSelected() ? table.getRowModel().rows : table.getRowModel().rows.filter(row => row.getIsSelected())}
                            resetSelection={() => table.toggleAllPageRowsSelected(false)}
                        />
                    </Box>
                </Box>
            }

            <ChakraTable
                size='sm'
                {...props.styling?.table}
            >

                <Thead>
                    {table.getHeaderGroups().map(headerGroup => (

                        <Tr key={headerGroup.id}>

                            {props.rowExpansion?.enabled && <Th></Th>}

                            {headerGroup.headers.map(header => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    <Box
                                        {...(
                                            header.column.getCanSort() &&
                                            (
                                                (isServerSorted(props.sortable) && getMetaFromColumn(header.column)?.sortable)
                                                || isLocalSorted(props.sortable)
                                            ) ? {
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
                        {table.getRowModel().rows.map(row => {

                            return (<Fragment key={row.id}>

                                <Tr {...getTrProps(row)} {...getRowStyleProps(row, props.styling?.row)}>

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
                                        <Td key={cell.id}
                                            {...getMetaFromColumn(cell.column)?.cellHoverText ? {
                                                title: String(cell.getValue() as any)
                                            } : {}}
                                            // width='100%'
                                            whiteSpace='nowrap'
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                                )}
                                        </Td>
                                    ))}
                                </Tr>

                                {(row.getIsExpanded() && props.rowExpansion?.renderComponent) && (
                                    <Tr {...getTrProps(row)}>
                                        <Td
                                            colSpan={row.getVisibleCells().length + 2}
                                            p={0}
                                        >
                                            <TableSubComponentLayout>
                                                {props.rowExpansion.renderComponent({ row })}
                                            </TableSubComponentLayout>
                                        </Td>
                                    </Tr>
                                )}
                            </Fragment>)
                        })}
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
                <Box marginTop='auto' w='100%'>
                    <Pagination
                        table={table}
                    />
                </Box>
            }
    </>
}

/**
 * Utils functions
 */

const isServerSorted = (sorting: TableProps<any>['sortable']): sorting is {
    state: string
    setState: React.Dispatch<React.SetStateAction<string>>
} => {
    return sorting !== undefined && typeof sorting !== 'boolean'
}

const isLocalSorted = (sorting: TableProps<any>['sortable']): sorting is boolean => {
    return sorting !== undefined && typeof sorting === 'boolean'
}

const getRowStyleProps = (row: Row<any>, style?: ChakraProps | ((row: Row<any>) => ChakraProps | undefined)) => {
    if (!style) return {}

    if (typeof style === 'function') return style(row) || {}
    else return style
}
