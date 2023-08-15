import { ChakraProps, Table as ChakraTable, Icon, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { ColumnDef, Row, RowData, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table'
import React, { Fragment } from 'react'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { DefaultTableCell } from '../DefaultTableCell/DefaultTableCell'

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

type TableProps<TData> = {
    data?: TData[]
    columns: any
    rowCanExpand?: boolean
    renderSubComponent?: React.FC<{ row: Row<TData> }>
    editable?: boolean
} & ChakraProps

export function Table<TData>({ data, columns, rowCanExpand, renderSubComponent, editable, ...props }: TableProps<TData>) {

    const [_, skipAutoResetPageIndex] = useSkipper()

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowCanExpand: () => !!rowCanExpand,
        getExpandedRowModel: getExpandedRowModel(),
        ...(editable ? {
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
        <TableContainer w='100%' {...props}>
            <ChakraTable>    
                <Thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Tr key={headerGroup.id}>
                            {rowCanExpand && <Th></Th>}
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
                            {rowCanExpand && 
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
                        {(row.getIsExpanded() && renderSubComponent) && (
                            <Tr>
                                <Td colSpan={row.getVisibleCells().length}>
                                    {renderSubComponent({ row })}
                                </Td>
                            </Tr>
                        )}
                    </Fragment>))}
                </Tbody>
            </ChakraTable>
        </TableContainer>
    </>
}