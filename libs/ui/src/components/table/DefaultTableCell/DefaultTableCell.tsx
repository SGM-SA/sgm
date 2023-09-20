import { Box, Input, Select } from '@chakra-ui/react'
import { Choice } from '../../../utils/table'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Column, Row, Table } from '@tanstack/react-table'

const fontSize = 'xs'

type DefaultTableCellProps<TData> = {
    getValue: () => unknown
    row: Row<TData>
    column: any
    table: Table<TData>
    children?: React.ReactNode
}

export function DefaultTableCell<TData>(props: DefaultTableCellProps<TData>) {

    if (props.column.columnDef.meta?.editable) return <EditableTableCell<TData> {...props} />
    else return <RawTableCell<TData> {...props} />
}

export function RawTableCell<TData>(props: DefaultTableCellProps<TData>) {

    const doubleClickHandler = () => {
        if (!props.column.columnDef.meta?.disableWarnings) toast.warn("Ce champs n'est pas éditable")
    }

    return <Box as='span' 
        fontSize={fontSize}
        onDoubleClick={doubleClickHandler}
    >
        {props.children || props.getValue() as any}
    </Box>
}

export function EditableTableCell<TData>(props: DefaultTableCellProps<TData>) {

    const initialValue = props.getValue()
    const meta = props.column.columnDef.meta // not typed on purpose
    const accessorKey = props.column.columnDef.accessorKey
    
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue)

    // When the input is blurred, we'll call our table meta's updateData function
    const onUpdate = (overrideValue?: any) => {

        if (meta.customValidation) {
            const result = meta.customValidation(value)
            if (result.type === 'error') {
                setValue(initialValue)
                toast.error(result.message)
                return
            }
        }

        props.table.options.meta?.updateData(props.row, accessorKey, overrideValue || value)
    }

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    switch (meta?.type) {

        case 'text':
        case 'number':
        case 'date':
            return (
                <Input
                    type={meta.type}
                    variant='unstyled'
                    fontSize={fontSize}
                    value={value as string || ''}
                    onChange={e => setValue(e.target.value)}
                    onBlur={() => onUpdate()}
                />
            )
            break
        case 'select':
            return (
                <Select 
                    size={fontSize} 
                    value={value as string}
                    onChange={e => {
                        setValue(e.target.value)
                        onUpdate(e.target.value)
                    }}
                >
                    {meta.nullable !== false && <option value={''}></option>}
                    {meta.choices?.map((choice: Choice) => typeof choice === 'string' ?
                        <option key={choice} value={choice}>{choice}</option> :
                        <option key={choice.value} value={choice.value}>{choice.label}</option>
                    )}
                </Select>
            )
            break
        case 'boolean': 
            return (
                <Input
                    type='checkbox'
                    variant='unstyled'
                    fontSize={fontSize}
                    value={value as string || ''}
                    onChange={e => setValue(e.target.value)}
                    onBlur={() => onUpdate()}
                />
            )
        default:
            <Input
                variant='unstyled'
                value={value as string || ''}
                fontSize={fontSize}
                onChange={e => setValue(e.target.value)}
                onBlur={() => onUpdate()}
            />
    }
}