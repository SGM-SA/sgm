import { ChakraProps, TableContainer, Table as ChakraTable, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react'
import { flexRender, getCoreRowModel, useReactTable, ColumnDef } from '@tanstack/react-table'
import React from 'react'

type TableProps<TData> = {
    data?: TData[]
    columns: any
} & ChakraProps

export function Table<TData>({ data, columns, ...props }: TableProps<TData>) {

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

	return <>
        <TableContainer>
            <ChakraTable>    
                <Thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Tr key={headerGroup.id}>
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
                    {table.getRowModel().rows.map(row => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <Td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </ChakraTable>
        </TableContainer>
    </>
}